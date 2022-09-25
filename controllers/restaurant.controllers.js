const { Restaurant } = require("../models/restaurant.model.js");
const { Review } = require("../models/review.model.js");

const createRestaurant = async (req, res) => {
    try {
        const { name, address, rating } = req.body;

        const restaurant = await Restaurant.create({
            name,
            address,
            rating,
        });

        if (!restaurant) {
            return res.status(400).json({
                status: "error",
                message: "restaurant no create",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                restaurant,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const allRestaurant = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({
            where: { status: "active" },

            include: [{ model: Review }],
        });
        res.status(200).json({
            status: "success",
            data: {
                restaurants,
            },
        });
    } catch (error) {
        console.log(error);
    }
};
const getRestaurantById = async (req, res) => {
    try {
        const { id } = req.params;

        const restaurants = await Restaurant.findOne({
            where: { id, status: "active" },
            include: [{ model: Review }],
        });
        res.status(200).json({
            status: "success",
            data: {
                restaurants,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const updateRestaurant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, address } = req.body;

        const restaurant = await Restaurant.findOne({
            where: { id, status: "active" },
        });
        if (!restaurant) {
            return res.status(404).json({
                status: "error",
                message: "Restaurant no found",
            });
        }
        await restaurant.update({ name, address });

        res.status(200).json({
            status: "success",
            data: {
                restaurant,
            },
        });
    } catch (error) {
        console.log(error);
    }
};
const deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.session;

        const restaurant = await Restaurant.findOne({
            where: { id, status: "active" },
        });

        if (!restaurant) {
            return res.status(404).json({
                status: "error",
                message: "Restaurant no found",
            });
        }

        await restaurant.update({ status: "deleted" });

        res.status(200).json({
            status: "success",
            data: {
                restaurant,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const reviewRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { id } = req.session;
        const { comment, rating } = req.body;

        const review = await Review.create({
            comment,
            rating,
            restaurantId,
            userId: id,
        });

        if (!review) {
            return res.status(404).json({
                status: "error",
                message: "review no found",
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                review,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const updateReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const { comment, address } = req.body;

        const review = await Review.findOne({
            where: { id, status: "active" },
        });
        await review.update({ comment, address });

        res.status(200).json({
            status: "success",
            data: {
                review,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

const deleteReviewById = async (req, res) => {
    try {
        const { id } = req.params;

        const review = await Review.findOne({
            where: { id, status: "active" },
        });

        if (!review) {
            return res.status(404).json({
                status: "error",
                message: "review no found",
            });
        }

        await review.update({ status: "delete" });

        res.status(200).json({
            status: "success",
            data: {
                review,
            },
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createRestaurant,
    allRestaurant,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    reviewRestaurant,
    updateReviewById,
    deleteReviewById,
};
