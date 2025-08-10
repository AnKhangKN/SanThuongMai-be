const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema(
  {
    name: String,
    value: String,
  },
  { _id: false }
);

const shippingByShopSchema = new mongoose.Schema(
    {
        shippingFee: { type: Number, required: true, min: 0 },

        shippingFeeFinal: { type: Number, required: true, min: 0 },

        shopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Shop",
            required: true,
        },
    },{
        _id: true
    }
)

// Schema chi tiết từng sản phẩm trong đơn hàng
const productItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    productName: { type: String, required: true },

    productImage: { type: String, required: true },

    attributes: [attributeSchema],

    price: { type: Number, required: true, min: 0 }, // Đây là tiền shop nhận được nếu không có salePrice

    salePrice: { type: Number, required: false, min: 0 }, // Đây là tiền shop giảm có thể nhận được nếu có sale

    finalPrice: { type: Number, required: true, min: 0 },

    quantity: { type: Number, required: true, min: 0 },

      noteItemsByShop: {
          type: String,
          default: "",
      },

    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },

    shopName: { type: String, required: false },

    // Trạng thái riêng của từng sản phẩm
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipping",
        "shipped",
        "delivered",
        "returned",
        "cancelled",
      ],
      default: "pending",
      required: true,
    },

    isReviewed: {
      type: Boolean,
      default: false,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },

    // khi bị returned
    imgReturnReason: [{ type: String }],

    refundRequested: { // Yêu cầu hoàn tiền
      type: Boolean,
      default: false,
    },

    refundReason: { // Lý do hoàn tiền
      type: String,
      default: "",
    },

    refundHandled: { // Hoàn tiền được xử lý
      type: Boolean,
      default: false,
    },
      
      returnedAt: {
        type: Date,
      },

    // Lý do hủy đơn
    cancelReason: {
      type: String,
      default: "",
    },

      canceledAt: {
        type: Date,
      }
  },
  { _id: false }
);

// Schema chính của đơn hàng
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    productItems: [productItemSchema], // Danh sách sản phẩm

    shippingAddress: {
      city: { type: String, required: true },
      address: { type: String, required: true },
      phone: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online", "Wallet"],
      default: "COD",
    },

    totalPrice: {
      // Tổng tiền đơn hàng
      type: Number,
      required: true,
    },

    vouchers: [
      {
          voucherName: {
              type: String,
              required: true,
              trim: true,
          },
          category: { // danh mục vận chuyển, danh mục sản phẩm, danh mục đạt móc đơn hàng, ...
              type: String,
              required: true,
          },
        code: { type: String }, // Mã người dùng đã nhập (SALE50)
          value: {
              type: Number,
              required: true,
              min: 0,
          },
          type: {
              type: String,
              enum: ['fixed', 'percentage'],
              required: true,
          },
        voucherId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Voucher",
        },
      },
    ],

    discountAmount: {
      // Sô tiền được giảm
      type: Number,
      default: 0,
    },

    finalAmount: {
      // Số tiền cuối cùng tính được
      type: Number,
      required: true,
    },

      shippingByShop: [shippingByShopSchema],

      shippingFee: {
        type: Number,
      },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },

    // Trạng thái đơn hàng tổng
    orderStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
