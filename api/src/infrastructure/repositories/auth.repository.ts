import {IUser} from "@/domain/interfaces/user.interface.js";
import {BaseRepository} from "./base.repository.js";
import userModel from "@/domain/entities/UsersModel.js";

export class AuthRepository extends BaseRepository<IUser> {
    constructor() {
        super(userModel, "User");
    }

    async findByEmailWithPassword(email: string) {
       return await this.model.findOne({email}).select("+password +isSeller");
    }

}

