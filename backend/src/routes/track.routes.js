import {Router} from "express"
import { addLeadWiseCallDetails, getLeadWiseCallDetails, getLeadsToCallToday } from "../controllers/track.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/restaurants/:id/add-call-details").post(verifyJWT,addLeadWiseCallDetails);
router.route("/restaurants/:id/calls").get(verifyJWT,getLeadWiseCallDetails);
router.route("/today-calls").get(verifyJWT,getLeadsToCallToday);

export default router; 