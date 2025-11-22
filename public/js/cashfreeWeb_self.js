const cashfree = Cashfree({
    mode: "sandbox",
});

document.getElementById("renderBtn").addEventListener("click",async()=>{
    try{
        //fetch payment session id from backend
        const reponse = await fetch("http://localhost:3000/payment/pay",{
            method: "POST",
        });
        const data = await reponse.json();
        const paymentSessionId = data.paymentSessionId;

        //intialize checkout options
        let checkoutOptions = {
            paymentSessionId:paymentSessionId,
            //?New page payment options
            redirectTarget: "_self", //default
        };
        //start the checkout process
        await cashfree.checkout(checkoutOptions);

    }catch(err){
        console.error("Error:",err);
    }
});