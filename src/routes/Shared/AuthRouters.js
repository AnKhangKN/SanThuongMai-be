const AuthControllers = require("../../controllers/Shared/AuthControllers");
const route = require("express").Router();
const {verifyEmail} = require("../../services/Shared/AuthServices");

route.post("/auth/login", AuthControllers.loginUser);

route.post("/auth/token/refresh", AuthControllers.refreshToken);

route.post("/auth/signup", AuthControllers.signUp);

route.post("/auth/logout", AuthControllers.logoutUser);

route.get("/auth/verify-email/:token", verifyEmail);

module.exports = route;
