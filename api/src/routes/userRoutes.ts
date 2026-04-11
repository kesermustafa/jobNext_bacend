import express from "express";
import {requireAuth} from "@/shared/middlewares/auth.middleware.js";
import userController from "@/app/controllers/user.controller.js"


const router = express.Router();



router.use(requireAuth);

router.route("/profile")
    .get(userController.profile)

router.route("/")
    .post(()=>{})
    .get(()=>{})



router.route("/:id")
    .get(()=>{})
    .patch(()=>{})
    .delete(()=>{})






export default router;