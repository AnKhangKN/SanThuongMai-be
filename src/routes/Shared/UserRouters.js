const UserControllers = require("../../controllers/Shared/UserControllers");
const express = require("express");
const { isUserMiddleware } = require("../../middleware/authMiddleware");

const route = express.Router();

route.post("/login", UserControllers.loginUser);

route.post("/refresh-token", UserControllers.refreshToken); // refresh token

route.post("/sign-up", UserControllers.createUser); // POST/ sign-up

route.get(
  "/get-detail-account/:id",
  isUserMiddleware,
  UserControllers.getDetailAccount
); // GET /get-detail-user/:id (vendor, admin, customer)

route.post(
  "/update-account/:id",
  isUserMiddleware,
  UserControllers.updateAccount
); // POST/ update-account/:id (name, phone, ...) (vendor, admin, customer)

// PATCH/ partial-update-user (name or phone or ...)

// PATCH/ change-password/:id

// POST/ send-verify-email, verify-email

// POST/ forgot-password, reset-password

// PATCH/ upload-avatar/:id

// DELETE/ delete-user/:id

module.exports = route;
