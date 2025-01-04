import mongoose,{Schema} from "mongoose";

const restaurantSchema = new Schema({
    restaurantName:{
        type : String,
        required : true,
        index : true
    },
    address : {
        type : String,
        required : true,
    },
    status:{
        type: String,
        enum: ['new', 'in-progress', 'closed'],
        default: 'new',
    },
    assignedKAM: {
        type:  mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    totalOrders:{
        type : Number,
        default : 0,
    },
    lastOrderDate:{
        type : Date,
        default : null,
    },
    performanceRating : {
        type : Number,
        default : null
    }
},
{timestamps : true})

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
