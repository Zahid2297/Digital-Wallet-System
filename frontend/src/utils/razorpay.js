export function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout({
  keyId,
  order,
  name,
  email,
  description = "Wallet top-up",
}) {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Failed to load Razorpay Checkout");
  }

  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: keyId,
      amount: order.amount,
      currency: order.currency || "INR",
      name: "NovaWallet",
      description,
      order_id: order.id,
      prefill: {
        name: name || "",
        email: email || "",
      },
      theme: { color: "#2563eb" },
      handler(response) {
        resolve(response);
      },
      modal: {
        ondismiss() {
          reject(new Error("Payment cancelled"));
        },
      },
    });

    rzp.on("payment.failed", (response) => {
      reject(
        new Error(
          response?.error?.description ||
            response?.error?.reason ||
            "Payment failed",
        ),
      );
    });

    rzp.open();
  });
}
