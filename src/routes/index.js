const UserRoutersCustomer = require("../routes/Customer/UserRouters");
const UserRoutersAdmin = require("../routes/Admin/UserRouters");
const AuthRoutersShared = require("../routes/Shared/AuthRouters");
const ProfileRoutersShared = require("../routes/Shared/ProfileRouters");

const routes = (app) => {
  // Shared API
  app.use("/api/shared", AuthRoutersShared);
  app.use("/api/shared", ProfileRoutersShared);

  // Customer API
  app.use("/api/customer", UserRoutersCustomer);

  // Vendor API

  // Admin API
  app.use("/api/admin", UserRoutersAdmin);
};

module.exports = routes;
