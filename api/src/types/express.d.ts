import "express";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            validated?: {
                body: any;
                query: any;
                params: any;
            };
        }
    }
}