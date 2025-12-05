const { createOrder, getPaymentStatusFromCF } = require("../services/cashfreeServices");
const { User } = require("../models");

// PAGE: Pay Now Button
exports.getPaymentPage = (req, res) => {
    res.sendFile("pay.html", { root: "public" });
};

// CREATE ORDER (AUTH REQUIRED)
exports.processPayment = async (req, res) => {
    const userId = req.user.id;  
    const customerId = String(userId);    

    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;

    try {
        // Pass userId to Cashfree
        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            "INR",
            customerId,         // IMPORTANT: pass real user id
            "9999999999"
        );

        res.json({ paymentSessionId, orderId, userId });

    } catch (error) {
        console.log("Error processing payment:", error);
        res.status(500).json({ message: "Payment failed" });
    }
};

// VERIFY PAYMENT (NO AUTH HERE)
exports.getPaymentStatus = async (req, res) => {
    const orderId = req.query.order_id;
    const userId = req.query.user_id;   // get from return_url

    try {
        const status = await getPaymentStatusFromCF(orderId);

        if (status === "Success") {
            // Mark PREMIUM using userId FROM QUERY
            await User.update(
                { isPremium: true },
                { where: { id: userId } }
            );

            return res.sendFile("success.html", { root: "public" });
        }

        return res.sendFile("failure.html", { root: "public" });

    } catch (err) {
        console.log(err);
        return res.status(500).send("Error verifying payment");
    }
};
