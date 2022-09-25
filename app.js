const express = require("express");

// Routers
const { usersRouter } = require("./routes/users.routes.js");
const { restaurantRouter } = require("./routes/restaurant.routes");
const { mealRouter } = require("./routes/meal.routes");
const { orderRouter } = require("./routes/order.routes");

const app = express();

app.use(express.json());

//Define endpoints
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/meals", mealRouter);
app.use("/api/v1/orders", orderRouter);

//Global error handler
app.use((error, req, res, next) => {
    res.status(400).json({
        status: "error",
        message: error.message,
        error,
    })
});

app.all("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `${req.method} ${req.url} does not exists in our server`,
    });
});

module.exports = { app };
