import { IUser } from "../interface/user.interface.js";
import { BaseRepository } from "./base.repository.js";
import UserModel from "../models/Users.js";

// src/repositories/auth.repository.ts
export class AuthRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel, "User");
    }

    async findByEmailWithPassword(email: string) {
        // Base'deki 'protected model' sayesinde burası çalışır
        return await this.model.findOne({ email }).select("+password");
    }
}