const UserRoutersCustomer = require("../routes/Customer/UserRouters");
const UserRoutersAdmin = require("../routes/Admin/UserRouters");
const AuthRoutersShared = require("../routes/Shared/AuthRouters");
const UserRoutersVendor = require("../routes/Vendor/ProductRouter");

const routes = (app) => {
  // Shared API
  app.use("/api/shared", AuthRoutersShared);

  // Customer API
  app.use("/api/customer", UserRoutersCustomer);

  // Vendor API
  app.use("/api/vendor", UserRoutersVendor);

  // Admin API
  app.use("/api/admin", UserRoutersAdmin);
};

module.exports = routes;
