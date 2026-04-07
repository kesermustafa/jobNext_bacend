
import { SignJWT, jwtVerify, JWTPayload } from "jose";
import {IUser} from "../interface/user.interface.js";
import {ACCESS_TOKEN_EXP, REFRESH_TOKEN_EXP} from "../constants/auth.js";
import {InvalidTokenError} from "../errors/SpecificErrors.js";
import {AppError} from "../errors/AppError.js";


const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError("Kritik yapılandırma hatası: JWT_SECRET tanımlanmamış!", 500);
    }
    return new TextEncoder().encode(secret);
};

export const generateTokens = async (user: IUser) => {
    const secret = getSecret();

    const payload = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
    };

    const accessToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(ACCESS_TOKEN_EXP )
        .sign(secret);

    const refreshToken = await new SignJWT({ id: user._id.toString() })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(REFRESH_TOKEN_EXP)
        .sign(secret);

    return { accessToken, refreshToken };
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
    try {
        const { payload } = await jwtVerify(token, getSecret());
        return payload;
    } catch (error: any) {
        if (error.code === 'ERR_JWT_EXPIRED') throw new InvalidTokenError("Oturum süresi doldu.");
        throw new InvalidTokenError("Geçersiz token.");
    }
};