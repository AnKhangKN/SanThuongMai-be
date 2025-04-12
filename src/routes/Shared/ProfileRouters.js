const ProfileControllers = require("../../controllers/Shared/ProfileControllers");
const express = require("express");
const { isUserMiddleware } = require("../../middleware/authMiddleware");

const route = express.Router();

route.get(
  "/get-detail-account/:id",
  isUserMiddleware,
  ProfileControllers.getDetailAccount
); // GET /get-detail-user/:id (vendor, admin, customer)

route.post(
  "/update-account/:id",
  isUserMiddleware,
  ProfileControllers.updateAccount
); // POST/ update-account/:id (name, phone, ...) (vendor, admin, customer)

module.exports = route;
