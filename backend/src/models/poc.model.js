import mongoose,{Schema} from "mongoose"

const POCSchema = new Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant", // Reference to the Restaurant model
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  email:{
    type : String,
    trim : true
  },
  
},{ timestamps: true });

export const POC = mongoose.model("POC", POCSchema);
