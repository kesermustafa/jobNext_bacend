import {UserRepository} from "../repositories/userRepository.js";


export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

}