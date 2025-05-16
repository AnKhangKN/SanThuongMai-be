const AuthControllers = require("../../controllers/Shared/AuthControllers");
const route = require("express").Router();
const checkVendorBanStatus = require("../../middleware/bannedUntilMiddleware");
const {verifyEmail} = require("../../services/Shared/AuthServices");

route.post("/login",checkVendorBanStatus, AuthControllers.loginUser);

route.post("/refresh-token", AuthControllers.refreshToken);

route.post("/sign-up", AuthControllers.createUser);

route.post("/logout", AuthControllers.logoutUser);

route.get("/verify/:token", verifyEmail);

module.exports = route;
