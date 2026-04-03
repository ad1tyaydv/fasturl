"use client";

import axios from "axios";
import React from "react";

export default function Page() {
  const handlePayment = async () => {
    try {
      const res = await axios.post("/api/payments");
      const order = res.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "FastURL",
        description: "Test Payment",
        order_id: order.id,
        handler: function (response: any) {
          console.log("Payment Successful:", response);
          alert("Payment successful!");
        },
        prefill: {
          name: "Aditya",
          email: "aditya@example.com",
          contact: "9999999999",
        },
        theme: { color: "#F37254" },

        method: {
          card: true,
          upi: true,
          netbanking: true,
          wallet: true,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Payment failed. Check console for details.");
    }
  };

  return (
    <div className="p-10">
      <button
        onClick={handlePayment}
        className="bg-red-500 text-white px-6 py-3 rounded"
      >
        Pay 300 INR (Test) - All Methods
      </button>
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  );
}