const { createOrder, getPaymentStatusFromCF } = require("../services/cashfreeServices");

// PAGE: Show Pay Now button
exports.getPaymentPage = (req, res) => {
    res.sendFile("pay.html", { root: "public" });
};


// CREATE ORDER
exports.processPayment = async (req, res) => {
    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const customerId = "1";
    const customerPhone = "9999999999";
    const token = req.headers.authorization?.split(" ")[1];

    try {
        const paymentSessionId = await createOrder(
            orderId,
            orderAmount,
            "INR",
            customerId,
            customerPhone,
            token
        );

        res.json({ paymentSessionId, orderId });

    } catch (error) {
        console.log("Error processing payment:", error.message);
        res.status(500).json({ message: "Payment failed" });
    }
};

// CHECK PAYMENT STATUS
exports.getPaymentStatus = async (req, res) => {
    const orderId = req.query.order_id;
  const token = req.query.token; 

    try {
        const status = await getPaymentStatusFromCF(orderId);

        if (status === "Success") {
            return res.sendFile("success.html", { root: "public" });
        }

        return res.sendFile("failure.html", { root: "public" });

    } catch (err) {
        return res.status(500).send("Error verifying payment");
    }
};

