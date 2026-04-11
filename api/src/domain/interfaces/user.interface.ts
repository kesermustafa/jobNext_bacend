import {Document} from "mongoose";

export interface IUser extends Document {
    userId: string;
    name: string;
    email: string;
    role: string;
    password?: string;
    passwordConfirm?: string;
    active: boolean;
    country: string,
    phone?: string,
    description?: string,
    isSeller: boolean,
    passwordChangedAt?: Date;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    deletedAt?: Date | null;
    photo?: string;

    // Metodlar
    correctPassword(candidate: string): Promise<boolean>;

    changedPasswordAfter(JWTTimestamp: number): boolean;

    createPasswordResetToken(): string;
}