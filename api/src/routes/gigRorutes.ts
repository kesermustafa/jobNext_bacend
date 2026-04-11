import express, {Router} from "express";
import {gigController} from "@/app/composition/index.js";
import {requireAuth} from "@/shared/middlewares/auth.middleware.js";
import upload from "@/shared/utils/multer.js";

const router: Router = express.Router();


router.use(requireAuth);

router.route("/")
    .post(
        upload.fields([
            {name: "coverImage", maxCount: 1},
            {name: "images", maxCount: 5},
        ]),
        gigController.create
    )
    .get(() => {
    })


router.route("/:id")
    .get(() => {
    })
    .patch(() => {
    })
    .delete(() => {
    })


export default router;