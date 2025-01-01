import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { CallTracker } from "../models/track.model.js";
import {Restaurant} from "../models/restaurant.model.js";
import {POC} from "../models/poc.model.js"

const getLeadWiseCallDetails = asyncHandler(async(req,res)=>{
    const leadId = req.params.id;

    if (!leadId) {
        throw new ApiError(400, "Lead ID is invalid");
    }

    const callDetails = await CallTracker
        .find({ lead: leadId })
        .populate("callTo", "name role contact")
        .populate("lead", "restaurantName address")
        .sort({ callDate: -1 })
        .select("callSummary rating callDate nextCallDate contactCount")

    if (!callDetails || callDetails.length === 0) {
        throw new ApiError(404, "No call details found for the specified lead");
    }

    return res.status(200).json(
        new ApiResponse(200, callDetails, "Call details retrieved successfully")
    );
})

const addLeadWiseCallDetails = asyncHandler(async(req,res)=>{
    const leadID = req.params.id;
    const {callTo,callSummary,rating,callDate,nextCallDate} = req.body;

    if(!callTo || !callSummary || !rating){
        throw new ApiError(400,"Missing required fields")
    }

    if(!leadID){
        throw new ApiError(400,"Missing leadID")
    }

    if(rating < 1 || rating>5){
        throw new ApiError(400,"Rating must be between 1 and 5");
    }

    const lead = await Restaurant.findById(leadID)
    if(!lead){
        throw new ApiError(404,"Lead not found")
    }

    const poc = await POC.findById(callTo)
    if(!poc){
        throw new ApiError(404,"POC not valid")
    }

    let calculatedNextCallDate = nextCallDate

    if (!calculatedNextCallDate) {
        const daysToNextCall = 6 - rating;
        calculatedNextCallDate = new Date();
        calculatedNextCallDate.setDate(calculatedNextCallDate.getDate() + daysToNextCall);
    }

    const contactCount = await CallTracker.countDocuments({ lead: leadID }) + 1;

    const newCall = await CallTracker.create({
        lead : leadID,
        callTo,
        callSummary,
        rating,
        callDate : callDate || Date.now(),
        nextCallDate : calculatedNextCallDate,
        contactCount
    })

    if(!newCall){
        throw new ApiError(500,"Failed tp create call details")
    }

    return res
    .status(201)
    .json(
        new ApiResponse(201,newCall,"Call details added successfully")
    )
});

const getLeadsToCallToday = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); 

    const leadsToCall = await CallTracker
        .find({ nextCallDate: { $gte: today, $lt: tomorrow } })
        .populate("lead", "restaurantName address")
        .populate("callTo", "name role contact")
        .select("lead callTo nextCallDate callSummary");

    // if (!leadsToCall || leadsToCall.length === 0) {
    //     new ApiError(404, "No leads to call today");
    // }

    return res.status(200).json(
        new ApiResponse(200, leadsToCall, "Leads to call today retrieved successfully")
    );
});



export {getLeadWiseCallDetails,addLeadWiseCallDetails,getLeadsToCallToday}
