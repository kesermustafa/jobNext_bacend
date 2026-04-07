
import { Document, Types } from "mongoose";

export interface IRefreshToken extends Document {
    userId: Types.ObjectId;
    token: string;
    ip?: string;
    userAgent?: string;
    expiresAt: Date;
    createdAt: Date;
}
