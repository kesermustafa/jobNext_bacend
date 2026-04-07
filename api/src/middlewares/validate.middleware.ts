import { ZodTypeAny, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodTypeAny) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            }) as any;

            req.validated = {
                body: parsed.body ?? {},
                query: parsed.query ?? {},
                params: parsed.params ?? {},
            };

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: "fail",
                    errors: error.issues.map((err) => ({
                        field: err.path.join("."),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
};