const UserRouter = require("../routes/Admin/UserRouter");

const routes = (app) => {
  app.use("/api/admin/user", UserRouter);
};

module.exports = routes;
