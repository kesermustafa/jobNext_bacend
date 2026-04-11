import express, {Router} from "express";
import authController from "@/app/controllers/auth.controller.js";
import {CreateUserSchema, LoginUserSchema} from "@/app/validators/user/user.schemaDTO.js";
import {validate} from "@/shared/middlewares/validate.middleware.js";
import {requireAuth} from "@/shared/middlewares/auth.middleware.js";
import multer from 'multer';

const upload = multer({storage: multer.memoryStorage()});

const router: Router = express.Router();

router.route("/register")
    .post(upload.single('photo'), validate(CreateUserSchema), authController.register)

router.route("/login")
    .post(validate(LoginUserSchema), authController.login)


router.use(requireAuth);

router.route("/refresh")
    .post(authController.refresh)

router.route("/logout")
    .post(authController.logout)


export default router;