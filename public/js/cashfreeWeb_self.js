const cashfree = Cashfree({ mode: "sandbox" });

document.getElementById("renderBtn").addEventListener("click", async () => {
    try {
        let token = localStorage.getItem("token");
        //  Send token in Authorization header
        const response = await fetch("/payment/pay", {
            method: "POST",
            headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    }

        });

        const data = await response.json();

        const paymentSessionId = data.paymentSessionId;

        let checkoutOptions = {
            paymentSessionId: paymentSessionId,
            redirectTarget: "_self",
        };

        await cashfree.checkout(checkoutOptions);

    } catch (err) {
        console.error("Error:", err);
    }
});
