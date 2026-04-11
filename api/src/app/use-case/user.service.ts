import {UserRepository} from "@/infrastructure/repositories/user.repository.js";
import {IUser} from "@/domain/interfaces/user.interface.js";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async getProfile(userId: string): Promise<IUser | null> {
        const user = await this.userRepository.findById(userId);
        if (!user) return null;
        return user;
    }

}