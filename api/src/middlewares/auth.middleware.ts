import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../utils/catchAsync.js";
import { UnauthorizedError } from "../errors/SpecificErrors.js";
import { ForbiddenError } from "../errors/SpecificErrors.js";
import * as jwtHelper from "../security/jwtHelper.js";
import {UserRepository} from "../repositories/user.repository.js";

const userRepository = new UserRepository();

export const requireAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Token Alımı
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return next(new UnauthorizedError("Lütfen giriş yapın."));
    }

    // 2) Token Doğrulama
    const decoded = await jwtHelper.verifyToken(token) as { id: string, iat: number };
    // jose verifyToken zaten hata fırlatıyor, catchAsync onu globalHandler'a atar.

    // 3) Kullanıcı Kontrolü
    // decoded içindeki 'id'yi kullanıyoruz (jose payloaddan gelir)
    const currentUser = await userRepository.findOne(
        { _id: decoded.id },
        { select: "+active" }
    );

    if (!currentUser) {
        return next(new UnauthorizedError("Bu token'a ait kullanıcı artık mevcut değil."));
    }

    // 4) Hesap Aktif mi?
    if (!currentUser.active) {
        return next(new ForbiddenError("Hesabınız dondurulmuş. Lütfen destekle iletişime geçin."));
    }

    // 5) Şifre Değişim Kontrolü
    // iat: issued at (tokenın üretilme zamanı)
    if (currentUser.changedPasswordAfter && decoded.iat) {
        if (currentUser.changedPasswordAfter(decoded.iat)) {
            return next(new UnauthorizedError("Şifre değiştirildi. Tekrar giriş yapın."));
        }
    }

    // 6) Req Objesine Ekleme
    req.user = currentUser;
    next();
});


export const restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!roles.includes(req.user.role)) {
            return next(new ForbiddenError("Bu işlemi yapmak için yetkiniz yok!"));
        }
        next();
    };
};