const express = require("express");
const { protectSession } = require("../middlewares/auth.middlewares.js");
const {
    createOrder,
    allOrderByUser,
    updateOrder,
    deleteOrder,
} = require("../controllers/order.controllers.js");
const { checkOrder } = require("../middlewares/order.middlewares.js");
const orderRouter = express.Router();

orderRouter.use(protectSession);

orderRouter.post("/", createOrder);
orderRouter.get("/me", allOrderByUser);
orderRouter.patch("/:id", checkOrder, updateOrder);
orderRouter.delete("/:id", checkOrder, deleteOrder);

module.exports = { orderRouter };
