const express = require("express");

const usersRouter = express.Router();

// Middlewares
const { userExist } = require("../middlewares/users.middlewares");
const {
  createUserValidators,
} = require("../middlewares/validators.middlewares");
const {
  protectSession,
  protectUserAccount,
  adminAccess,
} = require("../middlewares/auth.middlewares");

//Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/users.controller");

usersRouter.post("/", createUserValidators, createUser);

usersRouter.post("/login", login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get("/", adminAccess, getAllUsers);

usersRouter.patch(
  "/:id",
  userExist,
  adminAccess,
  protectUserAccount,
  updateUser
);

usersRouter.delete("/:id", userExist, protectUserAccount, deleteUser);

module.exports = { usersRouter };
