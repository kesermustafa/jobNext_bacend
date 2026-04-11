import { IUser } from "@/modules/user/interfaces/user.interface.js";

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            userId?: string;
            validated?: {
                body: any;
                query: any;
                params: any;
            };
        }
    }
}

// Bu satır dosyanın bir modül olarak kalmasını sağlar
export {};