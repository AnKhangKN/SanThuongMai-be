const AuthControllers = require("../../controllers/Shared/AuthControllers");
const route = require("express").Router();
const checkVendorBanStatus = require("../../middleware/bannedUntilMiddleware");

route.post("/login",checkVendorBanStatus, AuthControllers.loginUser);

route.post("/refresh-token", AuthControllers.refreshToken);

route.post("/sign-up", AuthControllers.createUser);

route.post("/logout", AuthControllers.logoutUser);

module.exports = route;
