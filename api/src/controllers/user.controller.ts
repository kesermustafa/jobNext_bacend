import {UserService} from "../services/user.service.js";



export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }


}