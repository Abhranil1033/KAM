import {Router} from "express"
import { createLead, getAllLeads, getCurrentLead, getLeadsByPerformance, updateLeadDetails } from "../controllers/restaurant.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/create-lead").post(verifyJWT,createLead)
router.route("/update-details/:id").put(verifyJWT,updateLeadDetails);
router.route("/details/:id").get(verifyJWT,getCurrentLead);
router.route("/restaurants/performance").get(verifyJWT,getLeadsByPerformance);
router.route("/restaurants/all").get(getAllLeads);


export default router;
