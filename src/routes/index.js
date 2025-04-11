const CustomerRouter = require("../routes/Customer/UserRouter");
const AdminRouter = require("../routes/Admin/UserRouters");

const routes = (app) => {
  app.use("/api/customer/", CustomerRouter);

  app.use("/api/admin", AdminRouter);
};

module.exports = routes;
