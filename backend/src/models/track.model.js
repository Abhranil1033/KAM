import mongoose,{Schema} from "mongoose";

const callTrackerSchema = new Schema({
    lead : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Restaurant",
        required : true
    },
    callTo : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "POC",
        required : true
    },
    callSummary : {
        type : String,
        required : true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    callDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    nextCallDate:{
        type: Date,
        default : null
    },
    contactCount: {
        type: Number,
        default: 0,
        required: true
    }
})

export const CallTracker = mongoose.model("CallTracker",callTrackerSchema)