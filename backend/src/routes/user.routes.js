import {Router} from "express"
import { registerUser,loginUser,logoutUser } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/user/register").post(registerUser)

router.route("/user/login").post(loginUser);

router.route("/user/logout").post(verifyJWT,logoutUser);

// router.route("/refresh-token").post(refreshAccessToken)

export default router
