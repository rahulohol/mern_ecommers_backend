const {razorpay} = require("../config/razorpay");
const crypto = require("crypto");
const axios = require("axios");


const https = require("https");


const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // only for this request
});


// exports.createOrder = async (req, res) => {
//   try {
//     const { totalAmount } = req.body;

//     console.log("Creating Razorpay order for amount:", totalAmount);

//     if (!totalAmount) {
//       return res.status(400).json({ error: "Amount is required" });
//     }

//     const order = await razorpay.orders.create({
//       amount: totalAmount * 100,
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     });

//     console.log("Razorpay order created:", order);
//     res.status(200).json(order);
//   } catch (err) {
//     console.error("Razorpay create order error:", err);
//     res.status(500).json({ error: err.message });
//   }
// };


// const razorpay = require("../config/razorpay");

// exports.createOrder = async (req, res) => {
//   try {
//     const { totalAmount } = req.body;

//     // console.log("Creating Razorpay order for amount:", totalAmount);
//     const numericAmount = Number(totalAmount);

//     // ✅ Proper validation
//     if (isNaN(numericAmount) || numericAmount <= 0) {
//       console.log("Invalid amount for Razorpay order:", numericAmount);
//       return res.status(400).json({
//         success: false,
//         message: "Amount must be a number greater than 0",
//       });
//     }

//     console.log("Validated amount for Razorpay order:", numericAmount);

//     const options = {
//       amount: Math.round(numericAmount * 100), // INR → paise
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order,
//     });
//   } catch (error) {
//     console.error("Razorpay create order error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Razorpay order creation failed",
//     });
//   }
// };

// exports.createOrder = async (req, res) => {
//   try {
//     let { totalAmount } = req.body;
//     console.log("Creating Razorpay order for amount:", totalAmount);

//     // ✅ HARD VALIDATION
//     amount = Number(totalAmount);

//     if (!amount || isNaN(amount) || amount <= 0) {
//       console.log("Invalid amount for Razorpay order:", amount);
//       return res.status(400).json({ message: "Invalid amount" });
//     }

//     const options = {
//       amount: Math.round(amount * 100), // MUST be integer
//       currency: "INR",
//       receipt: `receipt_${Date.now()}`,
//     };

//     console.log("Razorpay options:", options);

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({ success: true, order });
//   } catch (error) {
//     console.error("Razorpay create order error:", error);
//     res.status(500).json({
//       message: "Razorpay order creation failed",
//       error: error.message,
//     });
//   }
// };


exports.createOrder = async (req, res) => {
  try {
      const { totalAmount } = req.body;

    // console.log("Creating Razorpay order for amount:", totalAmount);
    const numericAmount = Number(totalAmount);

    // ✅ Proper validation
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.log("Invalid amount for Razorpay order:", numericAmount);
      return res.status(400).json({
        success: false,
        message: "Amount must be a number greater than 0",
      });
    }

    console.log("Validated amount for Razorpay order:", numericAmount);

    const options = {
      amount: Math.round(numericAmount * 100), // INR → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };


    // const response = await axios.post(
    //   "https://api.razorpay.com/v1/orders",
    //   // {
    //   //   amount: amount * 100,
    //   //   currency: "INR",
    //   //   receipt: `receipt_${Date.now()}`,
    //   // },
    //   options,
    //   {
    //     auth: {
    //       username: process.env.RAZORPAY_KEY_ID,
    //       password: process.env.RAZORPAY_KEY_SECRET,
    //     },
    //   }
    // );


    const response = await axios.post(
      "https://api.razorpay.com/v1/orders",
      options,
      {
        auth: {
          username: process.env.RAZORPAY_KEY_ID,
          password: process.env.RAZORPAY_KEY_SECRET,
        },
        httpsAgent, // 🔥 FIX HERE
      }
    );
    
    return res.status(200).json({
      success: true,
      order: response.data,
    });
  } catch (error) {
    console.error("Axios Razorpay error:", error.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      return res.json({ success: true });
    }

    res.status(400).json({ success: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
