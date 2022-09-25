const { Meal } = require("../models/meal.model.js");
const { Order } = require("../models/order.model.js");
const { Restaurant } = require("../models/restaurant.model.js");

const createOrder = async (req, res) => {
    const { quantity, mealId } = req.body;
    const { id } = req.session;
    const meal = await Meal.findOne({ where: { id: mealId } });
    if (!meal) {
        return res.status(400).json({
            status: "error",
            message: "meal no found",
        });
    }
    const order = await Order.create({
        quantity,
        totalPrice: quantity * meal.price,
        userId: id,
        mealId: mealId,
    });
    res.status(200).json({
        status: "success",
        data: {
            order,
        },
    });
};

const allOrderByUser = async (req, res) => {
    const { id } = req.session;
    const orders = await Order.findOne({
        where: { userId: id, status: "active" },
        include: [{ model: Meal, include: { model: Restaurant } }],
    });

    res.status(200).json({
        status: "success",
        data: {
            orders,
        },
    });
};

const updateOrder = async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id, status: "active" } });
    if (!order) {
        return res.status(400).json({
            status: "error",
            message: "order no found",
        });
    }
    await order.update({ status: "completed" });
    res.status(200).json({
        status: "success",
        data: {
            order,
        },
    });
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;

    const order = await Order.findOne({ where: { id, status: "active" } });
    if (!order) {
        return res.status(400).json({
            status: "error",
            message: "order no found",
        });
    }
    await order.update({ status: "deleted" });
    res.status(200).json({
        status: "success",
        data: {
            order,
        },
    });
};

module.exports = {
    createOrder,
    allOrderByUser,
    updateOrder,
    deleteOrder,
};
