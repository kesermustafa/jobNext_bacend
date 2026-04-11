import {Request, Response, NextFunction} from "express";
import {UserService} from "@/app/use-case/user.service.js";
import {catchAsync} from "@/shared/utils/catchAsync.js";
import {AppError} from "@/shared/errors/AppError.js";
import {UnauthorizedError} from "@/shared/errors/SpecificErrors.js";

class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    profile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

        if (!req.userId) {
            return next(new UnauthorizedError("Yetkisiz erişim"));
        }
        const user = await this.userService.getProfile(req.userId);

        if (!user) {
            return next(new AppError("Kullanıcı bulunamadı", 404));
        }

        res.status(200).json({
            status: "success",
            message: "Profil bilgileri alındı",
            data: user
        });
    });

}

export default new UserController();