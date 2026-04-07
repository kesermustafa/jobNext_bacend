import { IUser } from "../interface/user.interface.js";
import { BaseRepository } from "./base.repository.js";
import userModel from "../models/Users.js";

export class AuthRepository extends BaseRepository<IUser> {
    constructor() {
        super(userModel, "User");
    }


    async findByEmailWithPassword(email: string) {
        return this.model.findOne({ email }).select("+password");
    }

}

