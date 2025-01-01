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
        enum: ['new', 'in-progress', 'closed'], // Status options
        default: 'new',
    },
    assignedKAM: {
        type: String, // You can also use ObjectId if you have a User/KAM model
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
    averageOrderFrequency: {
        type : Number,
        default : null
    },
    performanceRating : {
        type : Number,
        min : 1,
        max : 5,
        default : null
    }
},
{timestamps : true})

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
