import {BaseRepository} from "./base.repository.js";
import {IUser} from "@/domain/interfaces/user.interface.js";
import users from "@/domain/entities/UsersModel.js";



 export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(users, "User");
    }



    async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return this.model.findOne({ email }).select("+password");
    }
}
