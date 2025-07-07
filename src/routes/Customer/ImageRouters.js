const { verifyToken} = require("../../middleware/authMiddleware");
const express = require("express");
const ImageControllers = require("../../controllers/Customer/ImageControllers");

const route = express.Router();

route.post("/upload-avatar", verifyToken, ImageControllers.uploadImage);

module.exports = route;