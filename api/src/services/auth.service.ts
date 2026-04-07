import {REFRESH_TOKEN_EXP} from "../constants/auth.js";
import {CreateUserDto, LoginUserDto} from "../dtos/UserDTO.js";
import RefreshToken from "../models/RefreshToken.js";
import {generateTokens, verifyToken} from "../security/jwtHelper.js";
import {AuthRepository} from "../repositories/auth.repository.js";
import {ConflictError, ForbiddenError} from "../errors/SpecificErrors.js";
import {ValidationError} from "../errors/SpecificErrors.js";
import {AppError} from "../errors/AppError.js";



export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    // Merkezi Cihaz Sınırı Kontrolü (Kod tekrarını önlemek için)
    async #handleDeviceLimit(userId: any) {
        const activeSessions = await RefreshToken.countDocuments({userId});
        if (activeSessions >= 3) {
            // En eski oturumu bul ve sil
            const oldestToken = await RefreshToken.findOne({userId}).sort({createdAt: 1});
            if (oldestToken) await oldestToken.deleteOne();
        }
    }

    async registerUser(data: CreateUserDto, ip?: string, userAgent?: string) {
        // 1. E-posta kontrolü
        const exists = await this.authRepository.findOne({ email: data.email });
        if (exists) throw new ConflictError("Bu e-posta zaten kayıtlı.");

        // 2. Kullanıcı oluştur
        const newUser = await this.authRepository.create(data);

        // 3. Tokenları üret
        const { accessToken, refreshToken } = await  generateTokens(newUser);

        // 4. Refresh Token'ı kaydet
        await this.saveRefreshToken(newUser._id.toString(), refreshToken, ip, userAgent);

        return { user: newUser, accessToken, refreshToken };
    }

    async login(data: LoginUserDto, ip?: string, userAgent?: string){
        const user = await this.authRepository.findByEmailWithPassword(data.email.toLowerCase());

        if (!user || !(await user.correctPassword(data.password))) {
            throw new ValidationError("E-posta veya şifre hatalı.");
        }

        // device limit
        await this.#handleDeviceLimit(user._id);

        const { accessToken, refreshToken } = await generateTokens(user);
        await this.saveRefreshToken(user._id.toString(), refreshToken, ip, userAgent);

        return { user, accessToken, refreshToken };
    }

    private async saveRefreshToken(userId: string, token: string, ip?: string, userAgent?: string) {
        // Cihaz sınırı kontrolü (Max 3 oturum)
        const sessionCount = await RefreshToken.countDocuments({ userId });
        if (sessionCount >= 3) {
            const oldest = await RefreshToken.findOne({ userId }).sort({ createdAt: 1 });
            if (oldest) await oldest.deleteOne();
        }

        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXP);

        await RefreshToken.create({ userId, token, ip, userAgent, expiresAt });
    }

    async logoutUser(token: string) {
        if (!token) return;
        await RefreshToken.deleteOne({token});
    }

    // 3) Refresh İşlemi
    async refreshTokens(oldToken: string, ip: string, userAgent : string) {
        const decoded = await verifyToken(oldToken) as { id: string };

        if (!decoded) throw new AppError("Oturum süresi dolmuş veya geçersiz token.", 401);

        const storedToken = await RefreshToken.findOne({token: oldToken});

        // REUSE DETECTION
        if (!storedToken) {
            await RefreshToken.deleteMany({userId: decoded.id});
            throw new AppError("Güvenlik ihlali! Tüm oturumlar kapatıldı.", 403);
        }

        await storedToken.deleteOne();

            await this.#handleDeviceLimit(decoded.id);

        const user = await this.authRepository.findById(decoded.id, {select: "+active"});

        if (!user) throw new AppError("Kullanıcı artık mevcut değil.", 404);
        if (!user.active) throw new ForbiddenError("Hesabınız dondurulmuş.");

        const tokens = await generateTokens(user);

        await RefreshToken.create({
            userId: user._id,
            token: tokens.refreshToken,
            ip,
            userAgent,
            expiresAt: new Date(Date.now() + REFRESH_TOKEN_EXP)
        });

        return tokens;
    }


}