import mongoose, { Schema } from "mongoose";
import {IRefreshToken} from "../interface/refreshToken.interface.js";


const refreshTokenSchema = new Schema<IRefreshToken>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    ip: String,
    userAgent: String,
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema);