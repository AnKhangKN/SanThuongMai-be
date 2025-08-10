const UserRoutersCustomer = require("../routes/Customer/UserRouters");
const UserRoutersAdmin = require("../routes/Admin/UserRouters");
const AuthRoutersShared = require("../routes/Shared/AuthRouters");
const ProductRoutersVendor = require("../routes/Vendor/ProductRouter");
const UserRouterVendor = require("../routes/Vendor/UserRouterVendor");
const ProductRouterAdmin = require("../routes/Admin/ProductRouters");
const ShopRouterAdmin = require("../routes/Admin/ShopRouters");
const ProductRoutersShared = require("../routes/Shared/ProductRouters");
const CartRoutersCustomer = require("../routes/Customer/CartRouters");
const OrderRoutersCustomer = require("../routes/Customer/OrderRouters");
const ImageRouters = require("../routes/Customer/ImageRouters");
const ShopRouters = require("../routes/customer/ShopRouters");
const OrderProducts = require("../routes/Vendor/OrderProducts");
const OrderRoutersAdmin = require("../routes/Admin/OderRouters");
const HomeRoutersAdmin = require("../routes/Admin/HomeRouters");
const PasswordRouterShared = require("../routes/shared/PasswordRouters");
const PromotionRouter = require("../routes/admin/PromotionRouters");
const CategoryRoutersAdmin = require("../routes/Admin/CategoryRoutes");
const CategoryRouterVendor = require("../routes/Vendor/CategoryRouterVendor");
const VoucherRoutersAdmin = require("../routes/Admin/VoucherRoutes");
const VoucherRoutersCustomer = require("../routes/Customer/VoucherRoutes");
const GenerateLogRoutesAi = require("./TrainingAi/GenerateLogRoutes");
const ChatRoutesShared = require("../routes/Shared/ChatRoutes");
const ProductSuggestRoutesAi = require("./TrainingAi/ProductSuggestRoutes");
const StatisticalRouterVendor = require("./Vendor/StatisticalRouterVendor");

const routes = (app) => {
  // Shared API
  app.use("/api/shared", AuthRoutersShared);

  app.use("/api/shared", ProductRoutersShared);

  app.use("/api/shared", PasswordRouterShared);

  app.use("/api/shared", ChatRoutesShared);

  // Customer API
  app.use("/api/customer", UserRoutersCustomer);

  app.use("/api/customer", CartRoutersCustomer);

  app.use("/api/customer", OrderRoutersCustomer);

  app.use("/api/customer", ImageRouters);

  app.use("/api/customer", ShopRouters);

  app.use("/api/customer", VoucherRoutersCustomer);

  // Vendor API
  app.use("/api/vendor", ProductRoutersVendor);
  app.use("/api/vendor", UserRouterVendor);
  app.use("/api/vendor", OrderProducts);
  app.use("/api/vendor", CategoryRouterVendor);
  app.use("/api/vendor", StatisticalRouterVendor);

  // Admin API
  app.use("/api/admin", UserRoutersAdmin);

  app.use("/api/admin", ProductRouterAdmin);

  app.use("/api/admin", ShopRouterAdmin);

  app.use("/api/admin", OrderRoutersAdmin);

  app.use("/api/admin", HomeRoutersAdmin);

  app.use("/api/admin", PromotionRouter);

  app.use("/api/admin", CategoryRoutersAdmin);

  app.use("/api/admin", VoucherRoutersAdmin);

  // Training Ai
  app.use("/api/ai", GenerateLogRoutesAi);
  app.use("/api/ai", ProductSuggestRoutesAi);
};

module.exports = routes;
