const PasswordController = require("../../controllers/Shared/PasswordControllers");
const express = require("express");
const route = express.Router();

route.post("/forget-password", PasswordController.forgetPassword);

module.exports = route;