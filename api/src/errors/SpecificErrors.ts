import {AppError} from "./AppError.js";


export class ConflictError extends AppError {
    constructor(message: string) {
        super(message, 409);
    }
}

export class NotFoundError extends AppError {
    constructor(entity: string) {
        super(`${entity} bulunamadı`, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400);
    }
}


export class UnauthorizedError extends AppError {
    constructor(message: string = "Yetkisiz erişim! Lütfen giriş yapın.") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message: string = "Bu işlem için yetkiniz bulunmamaktadır.") {
        super(message, 403);
    }
}

// Token süresi dolduğunda veya geçersiz olduğunda
export class InvalidTokenError extends AppError {
    constructor(message: string = "Oturum süreniz dolmuş veya geçersiz token.") {
        super(message, 401);
    }
}


// Token Reuse Detection (Yenileme tokenı çalındığında) durumları için
export class SecurityBreachError extends AppError {
    constructor(message: string = "Güvenlik ihlali tespit edildi! Lütfen tekrar giriş yapın.") {
        super(message, 403);
    }
}

// Rate limiting (Çok fazla istek atıldığında)
export class TooManyRequestsError extends AppError {
    constructor(message: string = "Çok fazla istek gönderdiniz. Lütfen biraz bekleyin.") {
        super(message, 429);
    }
}

// Veritabanı dökümanı var ama silinmiş (Soft delete durumu için)
export class DeletedResourceError extends AppError {
    constructor(entity: string) {
        super(`${entity} daha önce silinmiş veya artık mevcut değil.`, 410); // 410 Gone
    }
}

// Ödeme yetersizliği veya bakiye sorunları gibi durumlar
export class PaymentRequiredError extends AppError {
    constructor(message: string = "İşlem için ödeme gereklidir veya bakiye yetersizdir.") {
        super(message, 402);
    }
}

// Beklenen bir ön koşul sağlanmadığında (Örn: Email doğrulanmamışsa)
export class PreconditionFailedError extends AppError {
    constructor(message: string) {
        super(message, 412);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string = "Sunucu tarafında bir hata oluştu") {
        super(message, 500);
    }
}