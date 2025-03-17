const userController = require("../../controllers/Admin/UserController");

const express = require("express");
const router = express.Router();

router.post("/create", userController.createUser);

module.exports = router;
