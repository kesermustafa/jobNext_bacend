import express, {Router} from "express";
import authController from "@/app/controllers/auth.controller.js";
import {CreateUserSchema, LoginUserSchema} from "@/app/dtos/UserDTO.js";
import {validate} from "@/shared/middlewares/validate.middleware.js";
import {requireAuth} from "@/shared/middlewares/auth.middleware.js";

const router : Router = express.Router();

router.route("/register")
    .post(validate(CreateUserSchema),authController.register)

router.route("/login")
    .post(validate(LoginUserSchema), authController.login)


router.use(requireAuth);

router.route("/refresh")
    .post(authController.refresh)

router.route("/logout")
    .post(authController.logout)


export default router;