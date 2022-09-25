const { Meal } = require("../models/meal.model.js");
const { Restaurant } = require("../models/restaurant.model.js");

const createMeal = async (req, res) => {
    const { name, price } = req.body;
    const { id } = req.params;
    const meal = await Meal.create({ name, price, restaurantId: id });

    if (!meal) {
        return res.status(400).json({
            status: "error",
            message: "meal no create",
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            meal,
        },
    });
};

const allMeals = async (req, res) => {
    const meals = await Meal.findAll({
        where: { status: "active" },
        include: [{ model: Restaurant }],
    });

    res.status(200).json({
        status: "success",
        data: {
            meals,
        },
    });
};

const mealById = async (req, res) => {
    const { id } = req.params;
    const meals = await Meal.findOne({
        where: { id, status: "active" },
        include: [{ model: Restaurant }],
    });

    res.status(200).json({
        status: "success",
        data: {
            meals,
        },
    });
};

const updateMeal = async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;

    const meal = await Meal.findOne({ where: { id, status: "active" } });

    if (!meal) {
        return res.status(400).json({
            status: "error",
            message: "meal no found ",
        });
    }
    await meal.update({ name, price });

    res.status(200).json({
        status: "success",
        data: {
            meal,
        },
    });
};

const deleteMeal = async (req, res) => {
    const { id } = req.params;

    const meal = await Meal.findOne({ where: { id, status: "active" } });

    if (!meal) {
        return res.status(400).json({
            status: "error",
            message: "meal no found ",
        });
    }
    await meal.update({ status: "deleted" });

    res.status(200).json({
        status: "success",
        data: {
            meal,
        },
    });
};

module.exports = {
    createMeal,
    allMeals,
    mealById,
    updateMeal,
    deleteMeal,
};
