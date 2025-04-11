const SharedRouter = require("../routes/Shared/UserRouters");
const CustomerRouter = require("./Customer/UserRouters");
const AdminRouter = require("../routes/Admin/UserRouters");

const routes = (app) => {
  app.use("/api/shared", SharedRouter);

  app.use("/api/customer", CustomerRouter);

  app.use("/api/admin", AdminRouter);
};

module.exports = routes;
