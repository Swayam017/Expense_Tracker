const { createOrder, getPaymentStatusFromCF } = require("../services/cashfreeServices");
const User = require("../models/User");

// =======================
// PAGE: Pay Now Button
// =======================
exports.getPaymentPage = (req, res) => {
  res.sendFile("pay.html", { root: "public" });
};


// =======================
// CREATE ORDER (AUTH REQUIRED)
// =======================
exports.processPayment = async (req, res) => {
  try {
    const userId = req.user._id.toString();   // 🔥 FIX
    const customerId = userId;

    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;

    const paymentSessionId = await createOrder(
      orderId,
      orderAmount,
      "INR",
      customerId,
      "9999999999"
    );

    res.json({
      paymentSessionId,
      orderId,
      userId
    });

  } catch (error) {
    console.log("Error processing payment:", error);
    res.status(500).json({ message: "Payment failed" });
  }
};


// =======================
// VERIFY PAYMENT (NO AUTH)
// =======================
exports.getPaymentStatus = async (req, res) => {
  try {
    const orderId = req.query.order_id;
    const userId = req.query.user_id;

    const status = await getPaymentStatusFromCF(orderId);

    if (status === "Success") {

      // 🔥 FIX: Sequelize → Mongoose
      await User.findByIdAndUpdate(userId, {
        isPremium: true
      });

      return res.sendFile("success.html", { root: "public" });
    }

    return res.sendFile("failure.html", { root: "public" });

  } catch (err) {
    console.log(err);
    return res.status(500).send("Error verifying payment");
  }
};