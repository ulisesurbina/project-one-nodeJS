const express = require("express");
const { Restaurant } = require("../models/restaurant.model");
const { protectSession } = require("../middlewares/auth.middlewares.js");
const {
    checkRole,
    checkUserReview,
} = require("../middlewares/restaurant.middlewares");

const {
    createRestaurant,
    allRestaurant,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    reviewRestaurant,
    updateReviewById,
    deleteReviewById,
} = require("../controllers/restaurant.controllers");
const { createRestaurantValidators } = require("../controllers/validations");

const restaurantRouter = express.Router();

restaurantRouter.get("/", allRestaurant);
restaurantRouter.get("/:id", getRestaurantById);

restaurantRouter.use(protectSession);

restaurantRouter.post("/", createRestaurantValidators, createRestaurant);
restaurantRouter.patch("/:id", checkRole, updateRestaurant);
restaurantRouter.delete("/:id", checkRole, deleteRestaurant);
restaurantRouter.post("/reviews/:restaurantId", reviewRestaurant);
restaurantRouter.patch("/reviews/:id", checkUserReview, updateReviewById);
restaurantRouter.delete("/reviews/:id", checkUserReview, deleteReviewById);

module.exports = { restaurantRouter };
