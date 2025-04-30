const UserRoutersCustomer = require("../routes/Customer/UserRouters");
const UserRoutersAdmin = require("../routes/Admin/UserRouters");
const AuthRoutersShared = require("../routes/Shared/AuthRouters");
const UserRoutersVendor = require("../routes/Vendor/ProductRouter");
const ProductRouterAdmin = require("../routes/Admin/ProductRouters");
const ShopRouterAdmin = require("../routes/Admin/ShopRouters");


const routes = (app) => {
  // Shared API
  app.use("/api/shared", AuthRoutersShared);

  // Customer API
  app.use("/api/customer", UserRoutersCustomer);

  // Vendor API
  app.use("/api/vendor", UserRoutersVendor);

  // Admin API
  app.use("/api/admin", UserRoutersAdmin);

  app.use("/api/admin", ProductRouterAdmin);

  app.use("/api/admin", ShopRouterAdmin);

};

module.exports = routes;
