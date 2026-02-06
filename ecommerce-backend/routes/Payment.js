const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controller/Payment");

router.post("/create-order", createOrder);
router.post("/verify", verifyPayment);

// ✅ MUST export router directly
exports.router = router;
