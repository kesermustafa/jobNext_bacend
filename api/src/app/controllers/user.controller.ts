import {UserService} from "@/app/use-case/user.service.js";



export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }


}