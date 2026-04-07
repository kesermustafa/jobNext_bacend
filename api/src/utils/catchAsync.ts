import { Request, Response, NextFunction, RequestHandler } from 'express';

export const catchAsync = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next);
    };
};

type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

export const catchAsyncStrict = (fn: AsyncRequestHandler): RequestHandler => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};