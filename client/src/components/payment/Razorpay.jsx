import React from "react";

const CheckoutButton = ({ amount }) => {
    const handlePayment = async () => {
        const response = await fetch("/api/payment/order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });
        const order = await response.json();

        const options = {
            key: "rzp_test_d66qUmCyDPRQ8B", 
            amount: order.amount,
            currency: order.currency,
            name: "Your Company Name",
            description: "Test Transaction",
            order_id: order.id, // Order ID from backend
            handler: function (response) {
                alert("Payment Successful!");
                console.log(response);
            },
            prefill: {
                name: "John Doe",
                email: "john.doe@example.com",
                contact: "9999999999",
            },
            theme: {
                color: "#3399cc",
            },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
    };

    return <button onClick={handlePayment}>Pay Now</button>;
};

export default CheckoutButton;
