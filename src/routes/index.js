const UserRoutersCustomer = require("../routes/Customer/UserRouters");
const UserRoutersAdmin = require("../routes/Admin/UserRouters");
const AuthRoutersShared = require("../routes/Shared/AuthRouters");
const ProductRoutersVendor = require("../routes/Vendor/ProductRouter");
const UserRouterVendor = require("../routes/Vendor/UserRouterVendor");
const ProductRouterAdmin = require("../routes/Admin/ProductRouters");
const ShopRouterAdmin = require("../routes/Admin/ShopRouters");
const PlatformFeesRouterAdmin = require("../routes/Admin/PlatformFeesRouters");
const ProductRoutersShared = require("../routes/Shared/ProductRouters");
const CartRoutersCustomer = require("../routes/Customer/CartRouters");
const OrderRoutersCustomer = require("../routes/Customer/OrderRouters");
const ImageRouters = require("../routes/Customer/ImageRouters");
const ShopRouters = require("../routes/customer/ShopRouters");
const OrderProducts = require("../routes/Vendor/OrderProducts");
const OrderRoutersAdmin = require("../routes/Admin/OderRouters");
const HomeRoutersAdmin = require("../routes/Admin/HomeRouters");

const routes = (app) => {
  // Shared API
  app.use("/api/shared", AuthRoutersShared);

  app.use("/api/shared", ProductRoutersShared);

  // Customer API
  app.use("/api/customer", UserRoutersCustomer);

  app.use("/api/customer", CartRoutersCustomer);

  app.use("/api/customer", OrderRoutersCustomer);

  app.use("/api/customer", ImageRouters);

  app.use("/api/customer", ShopRouters);

  // Vendor API
  app.use("/api/vendor", ProductRoutersVendor);
  app.use("/api/vendor", UserRouterVendor);
  app.use("/api/vendor", OrderProducts);

  // Admin API
  app.use("/api/admin", UserRoutersAdmin);

  app.use("/api/admin", ProductRouterAdmin);

  app.use("/api/admin", ShopRouterAdmin);

  app.use("/api/admin", PlatformFeesRouterAdmin);

  app.use("/api/admin", OrderRoutersAdmin);

  app.use("/api/admin", HomeRoutersAdmin);
};

module.exports = routes;
