import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Restaurant } from "../models/restaurant.model.js"
import { User } from "../models/user.model.js"

const calculatePerformanceRating = (totalOrders, lastOrderDate, averageOrders, penaltyMultiplier = 1.20) => {
    if (totalOrders === 0 && !lastOrderDate) {
        return -Infinity;
    }

    const today = new Date();

    const orderStrength = totalOrders - averageOrders;

    let daysSinceLastOrder = 0;
    if (lastOrderDate) {
        const lastOrder = new Date(lastOrderDate);
        daysSinceLastOrder = Math.floor((today - lastOrder) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    }

    const penalty = daysSinceLastOrder * penaltyMultiplier;

    return orderStrength - penalty;
};

const createLead = asyncHandler(async (req, res) => {
    const { restaurantName, address, status, assignedKAM } = req.body;

    if ([restaurantName, address, status, assignedKAM].some((field) => typeof field === 'string' && field?.trim() == "")) {
        throw new ApiError(400, "Some fields are empty")
    }

    const kam = await User.findById(assignedKAM).select("_id username fullname");
    if (!kam) {
        throw new ApiError(404, "Assigned KAM does not exist");
    }

    const restaurant = await Restaurant.create({
        restaurantName,
        address,
        status,
        assignedKAM : kam._id,
        totalOrders: 0,
        lastOrderDate: null,
        averageOrderFrequency: null,
        performanceRating: -Infinity
    })

    const createdLead = await Restaurant.findById(restaurant._id).populate("assignedKAM", "username fullname email");

    if (!createdLead) {
        throw new ApiError(500, "Registration unsuccessful")
    }

    return res.status(201).json(
        new ApiResponse(201, createdLead, "Restaurant lead created successfully")
    )
})

const getCurrentLead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Lead ID is required")
    }

    const lead = await Restaurant.findById(id)

    if (!lead) {
        throw new ApiError(404, "Lead not found")
    }

    return res
        .status(200)
        .json(new ApiResponse(200, lead, "Current lead fetched successfully"));
})

const getAllLeads = asyncHandler(async (req, res) => {
    const leads = await Restaurant.find({})
        .select("restaurantName address status assignedKAM totalOrders lastOrderDate averageOrderFrequency performanceRating");

    if (!leads || leads.length === 0) {
        throw new ApiError(404, "No leads found");
    }

    return res.status(200).json(
        new ApiResponse(200, leads, "All leads retrieved successfully")
    );
});

const updateLeadDetails = asyncHandler(async (req, res) => {
    const { id } = req.params; 
    const updateFields = req.body;

    if (!id) {
        throw new ApiError(400, "Lead ID not provided");
    }

    if (!Object.keys(updateFields).length) {
        throw new ApiError(400, "No fields to update");
    }

    const currentLead = await Restaurant.findById(id);
    if (!currentLead) {
        throw new ApiError(404, "Lead not found");
    }

    if (updateFields.totalOrders !== undefined || updateFields.lastOrderDate !== undefined) {
        const totalOrders = updateFields.totalOrders ?? currentLead.totalOrders;
        const lastOrderDate = updateFields.lastOrderDate ?? currentLead.lastOrderDate;

        const allRestaurants = await Restaurant.find().select("totalOrders");
        const totalOrdersSum = allRestaurants.reduce((sum, restaurant) => sum + restaurant.totalOrders, 0);
        const averageOrders = totalOrdersSum / allRestaurants.length;

        const performanceRating = calculatePerformanceRating(
            totalOrders,
            lastOrderDate,
            averageOrders
        );

        updateFields.performanceRating = performanceRating;
    }

    const lead = await Restaurant.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true }
    );

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, lead, "Details updated successfully"));
});

const getLeadsByPerformance = asyncHandler(async (req, res) => {
    const restaurants = await Restaurant.find()
        .select("restaurantName address totalOrders lastOrderDate");

    if (!restaurants || restaurants.length === 0) {
        throw new ApiError(404, "No restaurants found");
    }

    const totalOrdersSum = restaurants.reduce((sum, restaurant) => sum + restaurant.totalOrders, 0);
    const averageOrders = totalOrdersSum / restaurants.length;

    const leadsWithPerformance = restaurants.map((restaurant) => {
        const performanceRating = calculatePerformanceRating(
            restaurant.totalOrders,
            restaurant.lastOrderDate,
            averageOrders
        );

        return {
            ...restaurant._doc, 
            performanceRating
        };
    });

    leadsWithPerformance.sort((a, b) => {
        if (b.performanceRating !== a.performanceRating) {
            return b.performanceRating - a.performanceRating; // Sort by performanceRating
        }
        return a.restaurantName.localeCompare(b.restaurantName); // Sort alphabetically by name
    });

    return res.status(200).json(
        new ApiResponse(200, leadsWithPerformance, "Restaurants sorted by performance rating retrieved successfully")
    );
});



export { createLead, updateLeadDetails, getCurrentLead, getLeadsByPerformance, getAllLeads }