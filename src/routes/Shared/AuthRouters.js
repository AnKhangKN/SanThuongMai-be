const AuthControllers = require("../../controllers/Shared/AuthControllers");
const route = require("express").Router();

route.post("/login", AuthControllers.loginUser);

route.post("/refresh-token", AuthControllers.refreshToken);

route.post("/sign-up", AuthControllers.createUser);

module.exports = route;
