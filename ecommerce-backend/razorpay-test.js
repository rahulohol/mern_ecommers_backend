require("dotenv").config();
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

(async () => {
  try {
    console.log("Testing Razorpay order creation...");
    const order = await razorpay.orders.create({
      amount: 100,
      currency: "INR",
      receipt: "test_receipt",
    });
    console.log("SUCCESS:", order);
  } catch (err) {
    console.error("ERROR:", err);
  }
})();
