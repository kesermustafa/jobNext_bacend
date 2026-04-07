import express, {Router} from "express";
import authController from "../controllers/auth.controller.js";

const router : Router = express.Router();


router.route("/register")
    .post(authController.register)

router.route("/login")
    .post(authController.login)

router.route("/refresh")
    .post(authController.refresh)

router.route("/logout")
    .post(authController.logout)


export default router;