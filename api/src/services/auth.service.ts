import {REFRESH_TOKEN_EXP} from "../constants/auth.js";
import {CreateUserDto} from "../dtos/UserDTO.js";
import RefreshToken from "../models/RefreshToken.js";
import {generateTokens} from "../security/jwtHelper.js";
import {AuthRepository} from "../repositories/auth.repository.js";
import {ConflictError} from "../errors/SpecificErrors.js";

export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
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

    // Login ve Refresh metodları da benzer şekilde tip güvenli hale getirilir...
}