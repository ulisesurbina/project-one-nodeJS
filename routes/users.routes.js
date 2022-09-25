const express = require("express");

// Controllers
const {
    createUser,
    allUsers,
    updateUser,
    deleteUser,
    login,
} = require("../controllers/users.controllers.js");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares.js");
const {
    createUserValidators,
} = require("../middlewares/validators.middlewares.js");
const { protectSession, protectUsersAccount, protectAdmin } = require("../middlewares/auth.middlewares.js");

const usersRouter = express.Router();

usersRouter.post("/signup", createUserValidators, createUser);

usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

// usersRouter.get("/", protectAdmin, allUsers);

usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);

usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

module.exports = { usersRouter };