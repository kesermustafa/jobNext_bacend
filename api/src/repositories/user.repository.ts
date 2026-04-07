// src/repositories/user.repository.ts

import {BaseRepository} from "./base.repository.js";
import {IUser} from "../interface/user.interface.js";
import UserModel from "../models/Users.js";



export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(UserModel, "User");
    }

    async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return await this.model.findOne({ email }).select("+password");
    }
}