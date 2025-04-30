const UserRoutersCustomer = require("../routes/Customer/UserRouters");
const UserRoutersAdmin = require("../routes/Admin/UserRouters");
const AuthRoutersShared = require("../routes/Shared/AuthRouters");
const ShopRoutersAdmin = require("../routes/Admin/ShopRouters");
const ProductRouterAdmin = require("../routes/Admin/ProductRouters");

const routes = (app) => {
  // Shared API
  app.use("/api/shared", AuthRoutersShared);

  // Customer API
  app.use("/api/customer", UserRoutersCustomer);

  // Vendor API

  // Admin API
  app.use("/api/admin", UserRoutersAdmin);

  app.use("/api/admin", ShopRoutersAdmin);

  app.use("/api/admin", ProductRouterAdmin);

};

module.exports = routes;
