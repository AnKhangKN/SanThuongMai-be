const UserRoutersCustomer = require("../routes/Customer/UserRouters");
const UserRoutersAdmin = require("../routes/Admin/UserRouters");
const AuthRoutersShared = require("../routes/Shared/AuthRouters");
const UserRoutersVendor = require("../routes/Vendor/ProductRouter");
const ProductRouterAdmin = require("../routes/Admin/ProductRouters");
const ShopRouterAdmin = require("../routes/Admin/ShopRouters");
const PlatformFeesRouterAdmin = require("../routes/Admin/PlatformFeesRouters");
const ProductRoutersShared = require("../routes/Shared/ProductRouters");

const routes = (app) => {
  // Shared API
  app.use("/api/shared", AuthRoutersShared);

  app.use("/api/shared", ProductRoutersShared);

  // Customer API
  app.use("/api/customer", UserRoutersCustomer);

  // Vendor API
  app.use("/api/vendor", UserRoutersVendor);

  // Admin API
  app.use("/api/admin", UserRoutersAdmin);

  app.use("/api/admin", ProductRouterAdmin);

  app.use("/api/admin", ShopRouterAdmin);

  app.use("/api/admin", PlatformFeesRouterAdmin)

};

module.exports = routes;
