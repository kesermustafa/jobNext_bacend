import express, {Router} from "express";
import authController from "../controllers/authController.js";

const router : Router = express.Router();


router.route("/register")
    .post(authController.register)


router.route("/login").post(()=>{
    console.log("login")
})
router.route("/refresh").post(()=>{console.log("refresh")})
router.route("/logout").post(()=>{console.log("logout")})


export default router;