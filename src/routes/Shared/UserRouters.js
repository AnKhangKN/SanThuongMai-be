const UserControllers = require("../../controllers/Shared/UserControllers");
const express = require("express");

const route = express.Router();

route.post("/login", UserControllers.loginUser);

route.post("/refresh-token", UserControllers.refreshToken); // refresh token

// POST/ sign-up

// POST/ update-user (name, phone, ...)

// PATCH/ partial-update-user (name or phone or ...)

// GET /get-detail-user/:id

// PATCH/ change-password/:id

// POST/ send-verify-email, verify-email

// POST/ forgot-password, reset-password

// PATCH/ upload-avatar/:id

// DELETE/ delete-user/:id

module.exports = route;
