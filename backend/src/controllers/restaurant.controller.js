import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { Restaurant } from "../models/restaurant.model.js"

const calculatePerformanceRating = (totalOrders, averageOrderFrequency, lastOrderDate) => {
    const daysSinceLastOrder = lastOrderDate
        ? Math.ceil((new Date() - new Date(lastOrderDate)) / (1000 * 60 * 60 * 24))
        : Infinity; // If no last order date, treat it as infinitely old

    if (totalOrders >= 10 && averageOrderFrequency <= 7 && daysSinceLastOrder <= 14) {
        return 5; // Excellent
    }
    if (totalOrders >= 5 && averageOrderFrequency <= 14) {
        return 4; // Good
    }
    if (totalOrders >= 2 && daysSinceLastOrder <= 30) {
        return 3; // Average
    }
    return 2; // Underperforming
};

const createLead = asyncHandler(async (req, res) => {
    const { restaurantName, address, status, assignedKAM } = req.body;

    if ([restaurantName, address, status, assignedKAM].some((field) => typeof field === 'string' && field?.trim() == "")) {
        throw new ApiError(400, "Some fields are empty")
    }

    const restaurant = await Restaurant.create({
        restaurantName,
        address,
        status,
        assignedKAM,
        totalOrders: 0,
        lastOrderDate: null,
        averageOrderFrequency: null,
        performanceRating: 1
    })

    const createdLead = await Restaurant.findById(restaurant._id)

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

    // Check if updateFields is empty
    if (!Object.keys(updateFields).length) {
        throw new ApiError(400, "No fields to update");
    }

    // Retrieve the current lead details
    const currentLead = await Restaurant.findById(id);
    if (!currentLead) {
        throw new ApiError(404, "Lead not found");
    }

    // Update totalOrders and recalculate other fields if necessary
    if (updateFields.totalOrders !== undefined) {
        const totalOrders = updateFields.totalOrders;

        // Calculate averageOrderFrequency
        let averageOrderFrequency = null;
        if (currentLead.lastOrderDate) {
            const daysSinceLastOrder = Math.ceil(
                (new Date() - new Date(currentLead.lastOrderDate)) / (1000 * 60 * 60 * 24)
            );
            averageOrderFrequency = Math.round(
                ((currentLead.averageOrderFrequency || daysSinceLastOrder) * (currentLead.totalOrders || 0) + daysSinceLastOrder) / 
                totalOrders
            );
        }

        // Update fields
        updateFields.averageOrderFrequency = averageOrderFrequency;

        // Calculate performanceRating
        const performanceRating = calculatePerformanceRating(
            totalOrders,
            averageOrderFrequency,
            currentLead.lastOrderDate
        );
        updateFields.performanceRating = performanceRating;
    }

    // Update the lead in the database
    const lead = await Restaurant.findByIdAndUpdate(
        id,
        { $set: updateFields },
        { new: true } // Return the updated document
    );

    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, lead, "Details updated successfully"));
});

const getLeadsByPerformance = asyncHandler(async (req, res) => {
    const { minRating, maxRating, status } = req.query;

    const filter = {};
    if (minRating) filter.performanceRating = { ...filter.performanceRating, $gte: parseInt(minRating, 10) };
    if (maxRating) filter.performanceRating = { ...filter.performanceRating, $lte: parseInt(maxRating, 10) };
    if (status) filter.status = status;

    const P = 2.00; // Penalty multiplier for performance score
    const today = new Date();

    const restaurants = await Restaurant.find(filter)
        .select("restaurantName address performanceRating status totalOrders lastOrderDate averageOrderFrequency");

    if (!restaurants || restaurants.length === 0) {
        throw new ApiError(404, "No leads found matching the criteria");
    }

    // Calculate performance scores for each restaurant
    const leadsWithPerformance = restaurants.map((restaurant) => {
        const { totalOrders, lastOrderDate } = restaurant;

        let daysSinceLastOrder = 0;
        if (lastOrderDate) {
            const lastOrder = new Date(lastOrderDate);
            daysSinceLastOrder = Math.floor((today - lastOrder) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        }

        // Apply penalty if lastOrderDate is more than 30 days ago
        const penalty = daysSinceLastOrder > 30 ? (daysSinceLastOrder - 30) * P : 0;
        const performanceScore = totalOrders - penalty;

        return {
            ...restaurant._doc, // Include all restaurant details
            performanceScore,
        };
    });

    // Sort restaurants by performance score (descending) and name (ascending)
    leadsWithPerformance.sort((a, b) => {
        if (b.performanceScore !== a.performanceScore) {
            return b.performanceScore - a.performanceScore; // Sort by performanceScore
        }
        return a.restaurantName.localeCompare(b.restaurantName); // Sort alphabetically by name
    });

    return res.status(200).json(
        new ApiResponse(200, leadsWithPerformance, "Leads sorted by performance score retrieved successfully")
    );
});


export { createLead, updateLeadDetails, getCurrentLead, getLeadsByPerformance, getAllLeads }