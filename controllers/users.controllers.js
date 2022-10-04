const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

// Models
const { User } = require("../models/user.model.js");
const { Order } = require("../models/order.model.js");
const { Meal } = require("../models/meal.model.js");
const { Restaurant } = require("../models/restaurant.model.js");    

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");

dotenv.config({ path: "./config.env" });

const createUser = catchAsync(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (role !== "admin" && role !== "normal") {
        return res.status(400).json({
            status: "error",
            message: "Invalid role",
        });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    // Remove password from response
    newUser.password = undefined; // Quita el password de la res, ya no se envia en res

    //201 -> Success and a resoure has been created
    res.status(201).json({
        status: "success",
        data: { newUser },
    });
});

const allUsers = catchAsync(async (req, res, next) => {
    const users = await User.findAll({
        attributes: { exclude: ["password", "createdAt", "updatedAt"] },
        where: { status: "active" },
        // include: [{ model: Order }],
    });
    res.status(200).json({
        status: "success",
        data: {
            users,
        },
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { session } = req;
    const { name, email } = req.body;

    await session.update({ name, email });

    res.status(200).json({
        status: "success",
        data: { session },
    });
});

const deleteUser = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;

    await sessionUser.update({ status: "deleted" });

    res.status(200).json({ status: "success", data: { sessionUser } });
});

const allOrders = catchAsync(async (req, res, next) => {
    const { id } = req.sessionUser;

    const orders = await Order.findAll({
        where: { userId: id },
        include: { model: Meal, include: { model: Restaurant } },
    });

    res.status(200).json({
        status: "success",
        data: {
            orders,
        },
    });
});

const orderById = catchAsync(async (req, res, next) => {
    try {
        const { id } = req.params;

        const orders = await Order.findOne({ where: { id } });

        if (!orders) {
            return res.status(200).json({
                status: "success",
                message: "order no found",
            });
        }
        res.status(200).json({
            status: "success",
            data: {
                orders,
            },
        });
    } catch (error) {
        console.log(error);
    }
});

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        attributes: { exclude: ["createdAt", "updatedAt"] },
        where: { email, status: "active" },
    });
    console.log(user);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({
            status: "error",
            message: "Wrong credentials",
        });
    }

    user.password = undefined;

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.status(200).json({
        status: "success",
        data: { user, token },
    });
});

module.exports = {
    createUser,
    allUsers,
    updateUser,
    deleteUser,
    allOrders,
    orderById,
    login,
};
