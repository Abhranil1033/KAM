import {Router} from "express"
import { addPOC, getPOCsByRestaurant } from "../controllers/poc.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/restaurants/:id/add-poc").post(verifyJWT,addPOC);
router.route("/restaurants/:id/pocs").get(verifyJWT, getPOCsByRestaurant);

export default router;


