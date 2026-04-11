import {Request, Response, NextFunction, CookieOptions} from "express";
import {catchAsync} from "@/shared/utils/catchAsync.js";
import {AuthService} from "@/app/use-case/auth.service.js";
import {ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP} from "@/shared/constants/auth.js";
import {UnauthorizedError} from "@/shared/errors/SpecificErrors.js";
import {uploadFromBuffer} from "@/shared/utils/cloudinary.js";
import {CreateUserDto} from "@/app/validators/user/user.schemaDTO.js";

class AuthController {
    private authService: AuthService;

    private readonly cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    };

    constructor() {
        this.authService = new AuthService();
    }

    register = catchAsync(async (req: Request, res: Response) => {

        let photoUrl: string | undefined;

        if (req.file?.buffer) {
            const uploadResult = await uploadFromBuffer(req.file.buffer, "avatars", req.file.mimetype);
            photoUrl = uploadResult.secure_url;
        }

        const validatedData: CreateUserDto = {
            ...req.validated!.body,
            ...(photoUrl && {photo: photoUrl})
        };

        const {user, accessToken, refreshToken} = await this.authService.registerUser(
            validatedData,
            req.ip,
            req.headers['user-agent']
        );

        res.cookie('accessToken', accessToken, {
            ...this.cookieOptions,
            maxAge: ACCESS_TOKEN_EXP
        });

        res.cookie('refreshToken', refreshToken, {
            ...this.cookieOptions,
            maxAge: REFRESH_TOKEN_EXP
        });

        res.status(201)
            .json({
                status: "success",
                data: {user, accessToken}
            });
    });

    login = catchAsync(async (req: Request, res: Response) => {

        const validatedData = req.validated!.body;

        const {user, accessToken, refreshToken} =
            await this.authService.login(validatedData, req.ip, req.headers['user-agent']);

        res.cookie('accessToken', accessToken, {
            ...this.cookieOptions,
            maxAge: ACCESS_TOKEN_EXP
        });

        res.cookie('refreshToken', refreshToken, {
            ...this.cookieOptions,
            maxAge: REFRESH_TOKEN_EXP
        });

        res.status(200).json({
            status: "success",
            data: {
                user: user.toJSON(),
                accessToken
            }
        })
    });

    logout = catchAsync(async (req: Request, res: Response) => {

        const {refreshToken} = req.cookies;

        if (!refreshToken) {
            return res.status(204).json({
                status: "success",
                message: "Zaten çıkış yapılmış."
            });
        }

        await this.authService.logoutUser(refreshToken);

        res.clearCookie('accessToken', this.cookieOptions);
        res.clearCookie('refreshToken', this.cookieOptions);

        res.status(200).json({
            status: "success",
            message: "Başarıyla çıkış yapıldı."
        })

    });

    refresh = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const {refreshToken: oldToken} = req.cookies;

        if (!oldToken) {
            return next(new UnauthorizedError("Lütfen tekrar giriş yapın."));
        }

        const tokens = await this.authService.refreshTokens(
            oldToken,
            req.ip || 'unknown',
            req.headers['user-agent'] || 'unknown'
        );

        // Access Token Cookie
        res.cookie('accessToken', tokens.accessToken, {
            ...this.cookieOptions,
            maxAge: ACCESS_TOKEN_EXP // 1 saat
        });

        // Refresh Token Cookie (Burası kritik!)
        res.cookie('refreshToken', tokens.refreshToken, {
            ...this.cookieOptions,
            maxAge: REFRESH_TOKEN_EXP // 24 saat
        });

        res.status(200).json({
            status: "success",
            accessToken: tokens.accessToken
        });
    });
}

export default new AuthController();