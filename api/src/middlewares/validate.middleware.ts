import { ZodTypeAny, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

// 1️⃣ Express Request'e validated ekle
declare module "express-serve-static-core" {
    interface Request {
        validated?: {
            body: any;
            query: any;
            params: any;
        };
    }
}

// 2️⃣ Zod error formatlama
export const formatZodError = (error: ZodError) => {
    return error.issues.map(err => ({
        field: err.path.join("."),
        message: err.message,
    }));
};

// 3️⃣ Middleware
export const validate = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req.body);
            req.validated = {params: undefined, query: undefined, body: parsed };
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: "fail",
                    errors: error.issues.map(err => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
};