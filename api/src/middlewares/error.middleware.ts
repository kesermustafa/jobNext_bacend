
import { Request, Response, NextFunction } from 'express';
import {AppError} from "../errors/AppError.js";


// Mongoose Hatalarını Yakalamak İçin Yardımcı Fonksiyonlar (Tiplerle)
const handleCastErrorDB = (err: any): AppError => {
    const message = `Geçersiz ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any): AppError => {
    const value = Object.values(err.keyValue)[0];
    const message = `Kopyalanmış alan değeri: "${value}". Lütfen başka bir değer kullanın!`;
    return new AppError(message, 409);
};

const handleValidationErrorDB = (err: any): AppError => {
    const errors = Object.values(err.errors).map((el: any) => el.message);
    const message = `Geçersiz girdi verisi. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
    new AppError('Geçersiz token. Lütfen tekrar giriş yapın!', 401);

const handleJWTExpiredError = (): AppError =>
    new AppError('Oturum süreniz dolmuş! Lütfen tekrar giriş yapın.', 401);

// Geliştirme Ortamı Yanıtı
const sendErrorDev = (err: AppError, res: Response): void => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};

// Üretim Ortamı Yanıtı
const sendErrorProd = (err: AppError, res: Response): void => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Yazılımsal bir sızıntı veya bilinmeyen hata
        console.error('💥 ERROR:', err);
        res.status(500).json({
            status: 'error',
            message: 'Bir şeyler ters gitti!'
        });
    }
};

// GLOBAL ERROR MIDDLEWARE
export const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else {
        let error = { ...err };
        error.message = err.message;

        // Multer / Dosya Boyutu Hatası
        if (err.code === 'LIMIT_FILE_SIZE') {
            error = new AppError('Dosya boyutu çok büyük! Maksimum limit 10MB.', 400);
        }

        // Mongoose Hata Yakalama
        if (err.name === 'CastError') error = handleCastErrorDB(error);
        if (err.code === 11000) error = handleDuplicateFieldsDB(error);
        if (err.name === 'ValidationError') error = handleValidationErrorDB(error);

        // JWT Hata Yakalama (jose veya jwt paketlerinden gelen hata isimleri)
        if (err.name === 'JsonWebTokenError' || err.code === 'ERR_JWT_INVALID') error = handleJWTError();
        if (err.name === 'TokenExpiredError' || err.code === 'ERR_JWT_EXPIRED') error = handleJWTExpiredError();

        sendErrorProd(error, res);
    }
};