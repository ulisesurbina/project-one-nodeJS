const { Order } = require("../models/order.model.js");

const checkOrder = async (req, res, next) => {
    const { id } = req.params;
    const { sessionUser } = req;

    const order = await Order.findOne({ where: id });
    if (!order) {
        return res.status(400).json({
            status: "error",
            message: "Order not found",
        });
    }

    if (order.userId !== sessionUser.id) {
        return res.status(400).json({
            status: "error",
            message: "Access denied",
        });
    }

    next();
};
module.exports = { checkOrder };
