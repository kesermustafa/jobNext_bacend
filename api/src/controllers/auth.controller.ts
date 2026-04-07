
import { Request, Response, NextFunction } from "express";
import {catchAsync} from "../utils/catchAsync.js";
import {AuthService} from "../services/auth.service.js";

import {ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP} from "../constants/auth.js";
import {CreateUserSchema, LoginUserSchema} from "../dtos/UserDTO.js";


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

    login = catchAsync(async (req: Request, res: Response) => {

        const validatedData = LoginUserSchema.parse(req.body);

        console.log("Login calisti,", validatedData)

        res.status(200).json({
            status: "success",

        })
    });

    logout = catchAsync(async (req: Request, res: Response) => {

    });

    refresh = catchAsync(async (req: Request, res: Response) => {

    });
}

export default new AuthController();