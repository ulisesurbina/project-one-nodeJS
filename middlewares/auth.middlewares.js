const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

const { User } = require("../models/user.model.js");

// Utils
const { catchAsync } = require("../utils/catchAsync.util.js");

dotenv.config({ path: "./config.env" });

const protectSession = catchAsync(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(403).json({
            status: "error",
            message: "Invalid session",
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
        where: { id: decoded.id, status: "active" },
    });
    if (!user) {
        return res.status(403).json({
            status: "error",
            message: "The owner of the session is no a longer active",
        });
    }
    req.sessionUser = user;
    next();
});

const protectUsersAccount = (req, res, next) => {
    const { sessionUser, user } = req;

    if (sessionUser.id !== user.id) {
        return res.status(403).json({
            status: "error",
            message: "You are not the owner of this account.",
        });
    }
    next();
};

// const protectPostOwners = (req, res, next) => {
//     const { sessionUser, post } = req;
//     if (sessionUser.id !== post.id) {
//         return res.status(403).json({
//             status: "error",
//             message: "This post does not belong to you.",
//         });
//     }
//     next();
// };

// const protectCommentsOwners = (req, res, next) => {
//     const { sessionUser, comment } = req;
//     if (sessionUser.id !== comment.id) {
//         return res.status(403).json({
//             status: "error",
//             message: "This comment does not belong to you.",
//         });
//     }
//     next();
// };

const protectAdmin = (req, res, next) => {
    const { sessionUser } = req;
    if (sessionUser.role !== "admin") {
        return res.status(403).json({
            status: "error",
            message: "You do not have the access level for this data.",
        });
    }
    next();
};

module.exports = {
    protectSession,
    protectUsersAccount,
    // protectPostOwners,
    // protectCommentsOwners,
    protectAdmin,
};
