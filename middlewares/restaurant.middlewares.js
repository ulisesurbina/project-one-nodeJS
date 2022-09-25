const { Review } = require("../models/review.model.js");

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");

const checkRole = catchAsync(async (req, res, next) => {
        const { sessionUser } = req;

        if (sessionUser.role !== "admin") {
            return res
                .status(400)
                .json({ status: "error", messages: "Access denied" });
        }
        next();
});
const checkUserReview = catchAsync(async (req, res, next) => {
        const { id } = req.params;

        const { sessionUser } = req;
        const review = await Review.findOne({ where: { id } });

        if (sessionUser.id !== review.userId) {
            return res
                .status(400)
                .json({ status: "error", messages: "Access denied" });
        }
        next();
});
module.exports = {
    checkRole,
    checkUserReview,
};
