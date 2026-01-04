const { Cashfree, CFEnvironment } = require ("cashfree-pg");

const env =
  process.env.CASHFREE_ENV === "PRODUCTION"
    ? CFEnvironment.PRODUCTION
    : CFEnvironment.SANDBOX;

const cashfree = new Cashfree(
  env,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY
);


// Expire after 60 minutes
const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
const formattedExpiryDate = expiryDate.toISOString();

exports.createOrder = async (orderId, orderAmount, orderCurrency='INR', customerId, customerPhone) => {
    try {
        const request = {
            order_amount: orderAmount,
            order_currency: orderCurrency,
            order_id: orderId,
            customer_details: {
                 customer_id: String(customerId),
                customer_phone: customerPhone,
            },
              payment_methods: "cc,nb,upi,paylater",
            order_meta: {
               return_url: `${process.env.APP_BASE_URL}/payment/payment-status?order_id=${orderId}&user_id=${customerId}`,
                
            },
            order_expiry_time:formattedExpiryDate,
        };

        const response = await cashfree.PGCreateOrder(request);
       

        return response.data.payment_session_id;

    } catch (error) {
        console.error("Error creating order", error.response?.data || error.message);
    }
};

// PG v2 — Check Status
exports.getPaymentStatusFromCF = async (orderId) => {
    try {
        console.log("Checking Status For:", orderId);

        const response = await cashfree.PGOrderFetchPayments(orderId);
        let payments = response.data;

        // If NOT array, wrap inside array
        if (!Array.isArray(payments)) {
            payments = [payments];
        }

        let orderStatus;

        if (payments.some(txn => txn.payment_status === "SUCCESS")) {
            orderStatus = "Success";
        } else if (payments.some(txn => txn.payment_status === "PENDING")) {
            orderStatus = "Pending";
        } else {
            orderStatus = "Failure";
        }

        return orderStatus;

    } catch (error) {
        console.error("Error fetching order status:", error.response?.data || error.message);
        return "Failure";
    }
};
