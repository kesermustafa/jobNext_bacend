import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { randomBytes, createHash } from "node:crypto";
import {IUser} from "@/domain/interfaces/user.interface.js";
import {ROLES_LIST, UserRoles} from "@/shared/constants/UserRoles.js";


const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "User must have a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "User must have an email"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        role: {
            type: String,
            enum: ROLES_LIST,
            default: UserRoles.USER,
            index: true,
        },
        active: {
            type: Boolean,
            default: true,
            select: false,
        },

        country: {
            type: String,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
        },

        isSeller: {
            type: Boolean,
            default: false,
            select: false,
        },

        description: {
            type: String,
            trim: true,
        },

        photo: {
            type: String,
            default: "/images/users/profile_photo.webp",
        },
        password: {
            type: String,
            required: [true, "User must have a password"],
            minlength: 8,
            select: false,
        },
        passwordConfirm: {
            type: String,
            required: [
                function (this: IUser) {
                    return this.isNew || this.isModified("password");
                },
                "Lütfen şifrenizi onaylayın",
            ],
            validate: {
                validator: function (this: IUser, el: string) {
                    return el === this.password;
                },
                message: "Şifreler eşleşmiyor!",
            },
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        deletedAt: {
            type: Date,
            default: null,
            select: false,
            index: { expires: "90d" },
        },
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret: Record<string, any>) => {
                delete ret.password;
                delete ret.passwordConfirm;
                delete ret.passwordChangedAt;
                delete ret.passwordResetToken;
                delete ret.passwordResetExpires;
                delete ret.deletedAt;
                delete ret.isSeller;
                delete ret.__v;
                return ret;
            },
        }
    }
);

/**
 * MIDDLEWARES (Hooks)
 */

// Şifre Hashleme
userSchema.pre<IUser>("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password!, 12);
    this.passwordConfirm = undefined;

});

// Şifre Değişim Tarihi Güncelleme
userSchema.pre<IUser>("save", function () {
    if (!this.isModified("password") || this.isNew) return ;
    this.passwordChangedAt = new Date(Date.now() - 1000);
});

// Sorgu Filtreleme (Active Kontrolü)
userSchema.pre(/^find/, function (this: mongoose.Query<any, IUser>, next) {
    const options = this.getOptions() || {};
    if (this.getQuery().active !== undefined) return ;
    if (options.includeInactive) return  ;
    this.where({ active: true });

});

/**
 * METHODS
 */

// Şifre Doğrulama
userSchema.methods.correctPassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password || "");
};

// JWT Şifre Değişim Kontrolü
userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number): boolean {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt((this.passwordChangedAt.getTime() / 1000).toString(), 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Şifre Sıfırlama Token'ı
userSchema.methods.createPasswordResetToken = function (): string {
    const resetToken = randomBytes(32).toString("hex");

    this.passwordResetToken = createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;
};

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;