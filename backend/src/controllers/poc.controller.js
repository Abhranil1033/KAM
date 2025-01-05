import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Restaurant } from "../models/restaurant.model.js";
import { POC } from "../models/poc.model.js";

const addPOC = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const { name, role, contactInfo } = req.body;

    if (!name || !role || !contactInfo) {
        throw new ApiError(400, "All POC fields are required");
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
        throw new ApiError(404, "Restaurant not found");
    }

    const poc = await POC.create({
        restaurant: id,
        name,
        role,
        contactInfo
    });

    return res
        .status(201)
        .json(new ApiResponse(201, poc, "POC added successfully"));
});


const getPOCsByRestaurant = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const pocs = await POC.find({ restaurant: id });

    if (!pocs || pocs.length === 0) {
        throw new ApiError(404, "No POCs found for this restaurant");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, pocs, "POCs fetched successfully"));
});


export {addPOC,getPOCsByRestaurant}
