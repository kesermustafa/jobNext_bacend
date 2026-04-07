import {BaseRepository} from "./base.repository.js";
import {IUser} from "../interface/user.interface.js";
import users from "../models/Users.js";



export class UserRepository extends BaseRepository<IUser> {
    constructor() {
        super(users, "User");
    }

    async findByEmailWithPassword(email: string): Promise<IUser | null> {
        return this.model.findOne({ email }).select("+password");
    }
}