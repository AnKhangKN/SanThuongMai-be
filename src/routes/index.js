const UserRouter = require("../routes/Customer/UserRouter");

const routes = (app) => {
  app.use("/api/customer/", UserRouter);
};

module.exports = routes;
