const { Order } = require("./order.model.js");
const { User } = require("./user.model.js");
const { Restaurant } = require("./restaurant.model.js");
const { Meal } = require("./meal.model.js");
const { Review } = require("./review.model.js");

const initModels = () => {
    // 1 - 1

    Meal.hasOne(Order, { foreignKey: "mealId" });
    Order.belongsTo(Meal);

    // 1 - M

    User.hasMany(Order, { foreignKey: "userId" });
    Order.belongsTo(User);

    User.hasMany(Review, { foreignKey: "userId" });
    Review.belongsTo(User);

    Restaurant.hasMany(Meal, { foreignKey: "restaurantId" });
    Meal.belongsTo(Restaurant);

    Restaurant.hasMany(Review, { foreignKey: "restaurantId" });
    Review.belongsTo(Restaurant);
};
module.exports = { initModels };
