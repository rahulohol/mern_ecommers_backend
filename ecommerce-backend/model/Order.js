

// // const mongoose = require("mongoose");
// // const { Schema } = mongoose;

// // const orderSchema = new Schema(
// //   {
// //     items: {
// //       type: [Schema.Types.Mixed],
// //       required: true,
// //     },

// //     totalAmount: {
// //       type: Number,
// //       required: true,
// //     },

// //     totalItems: {
// //       type: Number,
// //       required: true,
// //     },

// //     user: {
// //       type: Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },

// //     // 🔹 Updated payment methods
// //     paymentMethod: {
// //       type: String,
// //       enum: ["COD", "RAZORPAY"],
// //       required: true,
// //     },

// //     // 🔹 Strict payment status
// //     paymentStatus: {
// //       type: String,
// //       enum: ["PENDING", "PAID", "FAILED"],
// //       default: "PENDING",
// //     },

// //     // 🔹 Razorpay specific fields
// //     razorpayOrderId: {
// //       type: String,
// //     },

// //     razorpayPaymentId: {
// //       type: String,
// //     },

// //     razorpaySignature: {
// //       type: String,
// //     },

// //     // 🔹 Order lifecycle
// //     status: {
// //       type: String,
// //       enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
// //       default: "PENDING",
// //     },

// //     selectedAddress: {
// //       type: Schema.Types.Mixed,
// //       required: true,
// //     },
// //   },
// //   { timestamps: true }
// // );

// // /* 🔹 Virtual ID */
// // orderSchema.virtual("id").get(function () {
// //   return this._id;
// // });

// // /* 🔹 JSON Transform */
// // orderSchema.set("toJSON", {
// //   virtuals: true,
// //   versionKey: false,
// //   transform: function (doc, ret) {
// //     delete ret._id;
// //   },
// // });

// // exports.Order = mongoose.model("Order", orderSchema);



// // model/Order.js - Updated Order Model with Tracking History

// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const trackingHistorySchema = new Schema({
//   status: {
//     type: String,
//     enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
//     required: true
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now,
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   location: {
//     type: String,
//     default: "Processing Center"
//   },
//   updatedBy: {
//     type: String,
//     default: "System"
//   }
// }, { _id: true });

// const orderSchema = new Schema(
//   {
//     items: {
//       type: [Schema.Types.Mixed],
//       required: true,
//     },

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     totalItems: {
//       type: Number,
//       required: true,
//     },

//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // 🔹 Updated payment methods
//     paymentMethod: {
//       type: String,
//       enum: ["COD", "RAZORPAY"],
//       required: true,
//     },

//     // 🔹 Strict payment status
//     paymentStatus: {
//       type: String,
//       enum: ["PENDING", "PAID", "FAILED"],
//       default: "PENDING",
//     },

//     // 🔹 Razorpay specific fields
//     razorpayOrderId: {
//       type: String,
//     },

//     razorpayPaymentId: {
//       type: String,
//     },

//     razorpaySignature: {
//       type: String,
//     },

//     // 🔹 Order lifecycle
//     status: {
//       type: String,
//       enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
//       default: "PENDING",
//     },

//     selectedAddress: {
//       type: Schema.Types.Mixed,
//       required: true,
//     },

//     // 🔹 NEW: Tracking History
//     trackingHistory: [trackingHistorySchema],

//     // 🔹 NEW: Estimated Delivery Date
//     estimatedDelivery: {
//       type: Date
//     },

//     // 🔹 NEW: Actual Delivery Date
//     deliveredAt: {
//       type: Date
//     },

//     // 🔹 NEW: Courier Information
//     courierInfo: {
//       name: String,
//       trackingNumber: String,
//       contactNumber: String
//     },

//     // 🔹 Soft delete flag
//     deleted: {
//       type: Boolean,
//       default: false
//     }
//   },
//   { timestamps: true }
// );

// /* 🔹 Virtual ID */
// orderSchema.virtual("id").get(function () {
//   return this._id;
// });

// /* 🔹 JSON Transform */
// orderSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: function (doc, ret) {
//     delete ret._id;
//   },
// });

// /* 🔹 Middleware: Set estimated delivery on order creation */
// orderSchema.pre('save', function(next) {
//   if (this.isNew && !this.estimatedDelivery) {
//     // Set estimated delivery to 7 days from now by default
//     const estimatedDate = new Date();
//     estimatedDate.setDate(estimatedDate.getDate() + 7);
//     this.estimatedDelivery = estimatedDate;
//   }

//   // Set deliveredAt when status changes to DELIVERED
//   if (this.isModified('status') && this.status === 'DELIVERED' && !this.deliveredAt) {
//     this.deliveredAt = new Date();
//   }

//   next();
// });

// exports.Order = mongoose.model("Order", orderSchema);


// model/Order.js - Updated Order Model with Tracking History

const mongoose = require("mongoose");
const { Schema } = mongoose;

const trackingHistorySchema = new Schema({
  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: "Processing Center"
  },
  updatedBy: {
    type: String,
    default: "System"
  }
}, { _id: true });

const orderSchema = new Schema(
  {
    items: {
      type: [Schema.Types.Mixed],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    totalItems: {
      type: Number,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 Updated payment methods
    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      required: true,
    },

    // 🔹 Strict payment status
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    // 🔹 Razorpay specific fields
    razorpayOrderId: {
      type: String,
    },

    razorpayPaymentId: {
      type: String,
    },

    razorpaySignature: {
      type: String,
    },

    // 🔹 Order lifecycle
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    selectedAddress: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // 🔹 NEW: Tracking History
    trackingHistory: [trackingHistorySchema],

    // 🔹 NEW: Estimated Delivery Date
    estimatedDelivery: {
      type: Date
    },

    // 🔹 NEW: Actual Delivery Date
    deliveredAt: {
      type: Date
    },

    // 🔹 NEW: Courier Information
    courierInfo: {
      name: String,
      trackingNumber: String,
      contactNumber: String
    },

    // 🔹 Soft delete flag
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

/* 🔹 Virtual ID */
orderSchema.virtual("id").get(function () {
  return this._id;
});

/* 🔹 JSON Transform */
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

/* 🔹 Middleware: Set estimated delivery on order creation */
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.estimatedDelivery) {
    // Set estimated delivery to 7 days from now by default
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + 7);
    this.estimatedDelivery = estimatedDate;
  }

  // Set deliveredAt when status changes to DELIVERED
  if (this.isModified('status') && this.status === 'DELIVERED' && !this.deliveredAt) {
    this.deliveredAt = new Date();
  }

  next();
});

exports.Order = mongoose.model("Order", orderSchema);