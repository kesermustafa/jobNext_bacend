import { SignJWT, jwtVerify, JWTPayload } from "jose";
import {IUser} from "@/domain/interfaces/user.interface.js";
import {InvalidTokenError} from "@/shared/errors/SpecificErrors.js";
import {AppError} from "@/shared/errors/AppError.js";


const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AppError("Kritik yapılandırma hatası: JWT_SECRET tanımlanmamış!", 500);
    }
    return new TextEncoder().encode(secret);
};

export const generateTokens = async (user: IUser) => {
    const secret = getSecret();
    const jti = crypto.randomUUID();

    const payload = {
        id: user._id.toString(),
        isSeller: user.isSeller,
        email: user.email,
        role: user.role,
    };

    const accessToken = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret);

    const refreshToken = await new SignJWT({ id: user._id.toString(), jti })
        .setProtectedHeader({ alg: "HS256", typ: "JWT" })
        .setIssuedAt()
        .setExpirationTime('24h')
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