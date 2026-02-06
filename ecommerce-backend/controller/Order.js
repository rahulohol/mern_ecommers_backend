// const { Order } = require("../model/Order");
// const { Cart } = require("../model/Cart");
// const { Product } = require("../model/Product");
// const { User } = require("../model/User");
// const { sendMail, invoiceTemplate } = require("../services/common");

// exports.fetchOrdersByUser = async (req, res) => {
//   const id = req.userId;
//   console.log(id);
//   try {
//     const orders = await Order.find({ user: id });

//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };



// exports.createOrder = async (req, res) => {
//   try {
//     const order = new Order({
//       ...req.body,
//       paymentStatus:req.body.paymentMethod === "RAZORPAY" ? "PAID" : "PENDING",   // PAID | PENDING
//       paymentMethod: req.body.paymentMethod,   // COD | RAZORPAY
//     });

//     console.log("Creating order -> ", order);

//     // 🔥 Reduce stock AFTER payment success OR COD
//     if (
//       order.paymentMethod === "COD" ||
//       order.paymentStatus === "PAID"
//     ) {
//       for (let item of order.items) {
//         const product = await Product.findById(item.product.id);

//         if (!product) {
//           return res.status(404).json({ message: "Product not found" });
//         }

//         if (product.stock < item.quantity) {
//           return res.status(400).json({
//             message: `Insufficient stock for ${product.title}`,
//           });
//         }

//         await Product.findByIdAndUpdate(
//           product._id,
//           { $inc: { stock: -item.quantity } }
//         );
//       }
//     }

//     const savedOrder = await order.save();

//     // 🛒 CLEAR CART (THIS IS THE FIX)
//     if (
//       savedOrder.paymentMethod === "COD" ||
//       savedOrder.paymentStatus === "PAID"
//     ) {
//       await Cart.deleteMany({ user: savedOrder.user });
//     }

//     const user = await User.findById(savedOrder.user);
//     sendMail({
//       to: user.email,
//       html: invoiceTemplate(savedOrder),
//       subject: "Order Received",
//     });

//     res.status(201).json(savedOrder);
//   } catch (err) {
//     console.error(err);
//     res.status(400).json({ message: err.message });
//   }
// };


// exports.deleteOrder = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const order = await Order.findByIdAndDelete(id);
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.updateOrder = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const order = await Order.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// exports.fetchAllOrders = async (req, res) => {
//   // sort = {_sort:"price",_order="desc"}
//   // pagination = {_page:1,_limit=10}
//   let query = Order.find({ deleted: { $ne: true } });
//   let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

//   if (req.query._sort && req.query._order) {
//     query = query.sort({ [req.query._sort]: req.query._order });
//   }

//   const totalDocs = await totalOrdersQuery.count().exec();
//   console.log({ totalDocs });

//   if (req.query._page && req.query._limit) {
//     const pageSize = req.query._limit;
//     const page = req.query._page;
//     query = query.skip(pageSize * (page - 1)).limit(pageSize);
//   }

//   try {
//     const docs = await query.exec();
//     res.set("X-Total-Count", totalDocs);
//     res.status(200).json(docs);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };



const { Order } = require("../model/Order");
const { Cart } = require("../model/Cart");
const { Product } = require("../model/Product");
const { User } = require("../model/User");
const { sendMail, invoiceTemplate } = require("../services/common");

// ============================================
// EXISTING FUNCTIONS (Enhanced with Tracking)
// ============================================

exports.fetchOrdersByUser = async (req, res) => {
  const id = req.userId;
  console.log(id);
  try {
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.createOrder = async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      paymentStatus: req.body.paymentMethod === "RAZORPAY" ? "PAID" : "PENDING",
      paymentMethod: req.body.paymentMethod,
    });

    // 🔹 Add initial tracking entry
    order.trackingHistory = [
      {
        status: order.status || "PENDING",
        timestamp: new Date(),
        message: "Order placed successfully",
        location: "Order Processing Center",
        updatedBy: "System"
      }
    ];

    // 🔹 Set estimated delivery (7 days from now)
    if (!order.estimatedDelivery) {
      const estimatedDate = new Date();
      estimatedDate.setDate(estimatedDate.getDate() + 7);
      order.estimatedDelivery = estimatedDate;
    }

    console.log("Creating order -> ", order);

    // 🔥 Reduce stock AFTER payment success OR COD
    if (
      order.paymentMethod === "COD" ||
      order.paymentStatus === "PAID"
    ) {
      for (let item of order.items) {
        const product = await Product.findById(item.product.id);

        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        if (product.stock < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.title}`,
          });
        }

        await Product.findByIdAndUpdate(
          product._id,
          { $inc: { stock: -item.quantity } }
        );
      }
    }

    const savedOrder = await order.save();

    // 🛒 CLEAR CART
    if (
      savedOrder.paymentMethod === "COD" ||
      savedOrder.paymentStatus === "PAID"
    ) {
      await Cart.deleteMany({ user: savedOrder.user });
    }

    const user = await User.findById(savedOrder.user);
    sendMail({
      to: user.email,
      html: invoiceTemplate(savedOrder),
      subject: "Order Received",
    });

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByIdAndDelete(id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

// 🔹 ENHANCED: Update order with tracking history
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // If status is being updated, add to tracking history
    if (req.body.status && req.body.status !== order.status) {
      const trackingEntry = {
        status: req.body.status,
        timestamp: new Date(),
        message: req.body.trackingMessage || getDefaultStatusMessage(req.body.status),
        location: req.body.trackingLocation || "Processing Center",
        updatedBy: req.user?.email || req.userId || "Admin"
      };

      // Initialize trackingHistory if it doesn't exist
      if (!order.trackingHistory) {
        order.trackingHistory = [];
      }

      order.trackingHistory.push(trackingEntry);
    }

    // Update order fields
    for (let key in req.body) {
      if (key !== 'trackingMessage' && key !== 'trackingLocation') {
        order[key] = req.body[key];
      }
    }

    // Set deliveredAt when status changes to DELIVERED
    if (req.body.status === 'DELIVERED' && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    // 🔹 Send email notification on status change
    if (req.body.status && req.body.status !== order.status) {
      try {
        const user = await User.findById(order.user);
        if (user && user.email) {
          sendMail({
            to: user.email,
            html: orderStatusUpdateTemplate(updatedOrder, req.body.status),
            subject: `Order Update: ${req.body.status}`,
          });
        }
      } catch (emailErr) {
        console.error("Failed to send status update email:", emailErr);
        // Don't fail the order update if email fails
      }
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.fetchAllOrders = async (req, res) => {
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });

  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;
    query = query.skip(pageSize * (page - 1)).limit(pageSize);
  }

  try {
    const docs = await query.exec();
    res.set("X-Total-Count", totalDocs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ============================================
// NEW TRACKING FUNCTIONS
// ============================================

// Get single order by ID (for tracking page)
exports.fetchOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate("user", "name email");
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow user to view their own order (unless admin)
    if (order.user._id.toString() !== req.userId && !req.user?.isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Add custom tracking update (Admin only)
exports.addTrackingUpdate = async (req, res) => {
  const { id } = req.params;
  const { message, location, status } = req.body;

  try {
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Initialize trackingHistory if it doesn't exist
    if (!order.trackingHistory) {
      order.trackingHistory = [];
    }

    const trackingEntry = {
      status: status || order.status,
      timestamp: new Date(),
      message: message || "Order update",
      location: location || "Processing Center",
      updatedBy: req.user?.email || req.userId || "Admin"
    };

    order.trackingHistory.push(trackingEntry);
    
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function getDefaultStatusMessage(status) {
  const messages = {
    PENDING: "Order received and is being processed",
    CONFIRMED: "Order confirmed and ready for shipping",
    SHIPPED: "Order has been shipped and is on the way",
    DELIVERED: "Order delivered successfully",
    CANCELLED: "Order has been cancelled"
  };
  return messages[status] || "Order status updated";
}

// Email template for order status updates
function orderStatusUpdateTemplate(order, newStatus) {
  const statusMessages = {
    PENDING: "We have received your order and it's being processed.",
    CONFIRMED: "Your order has been confirmed and will be shipped soon.",
    SHIPPED: "Great news! Your order is on its way.",
    DELIVERED: "Your order has been delivered successfully!",
    CANCELLED: "Your order has been cancelled."
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .status-badge { display: inline-block; padding: 10px 20px; background: #667eea; color: white; border-radius: 20px; font-weight: bold; margin: 20px 0; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .track-button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>${statusMessages[newStatus] || 'Your order status has been updated.'}</p>
          
          <div class="status-badge">Status: ${newStatus}</div>
          
          <div class="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> #${order.id.slice(-12).toUpperCase()}</p>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Total Amount:</strong> ₹${Math.round(order.totalAmount * 83).toLocaleString('en-IN')}</p>
            ${order.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> ${new Date(order.estimatedDelivery).toLocaleDateString('en-IN')}</p>` : ''}
          </div>
          
          ${order.courierInfo?.trackingNumber ? `
            <div class="order-details">
              <h3>Courier Information</h3>
              <p><strong>Courier:</strong> ${order.courierInfo.name}</p>
              <p><strong>Tracking Number:</strong> ${order.courierInfo.trackingNumber}</p>
            </div>
          ` : ''}
          
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/order-tracking/${order.id}" class="track-button">
              Track Your Order
            </a>
          </p>
          
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          
          <p>Thank you for shopping with us!</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}