
import { Request, Response, NextFunction } from "express";
import {catchAsync} from "../utils/catchAsync.js";
import {AuthService} from "../services/auth.service.js";

import {ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP} from "../constants/auth.js";
import {CreateUserSchema} from "../dtos/UserDTO.js";


class AuthController {
    private authService: AuthService;

    private cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/'
    };

    constructor() {
        this.authService = new AuthService();
    }

    register = catchAsync(async (req: Request, res: Response) => {

        const validatedData = CreateUserSchema.parse(req.body);

        const { user, accessToken, refreshToken } = await this.authService.registerUser(
            validatedData,
            req.ip,
            req.headers['user-agent']
        );


        res.cookie('accessToken', accessToken, {
            ...this.cookieOptions,
            maxAge: ACCESS_TOKEN_EXP
        });

        // Refresh Token Cookie
        res.cookie('refreshToken', refreshToken, {
            ...this.cookieOptions,
            maxAge: REFRESH_TOKEN_EXP
        });

        res.status(201)
            .json({
                status: "success",
                data: { user, accessToken }
            });
    });

    // Diğer metodlar (login, refresh, logout)...
}

export default new AuthController();