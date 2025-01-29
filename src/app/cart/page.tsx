"use client"; // Next.js-specific directive
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromCart, updateItemQuantity } from "../../redux/actions/cartActions";
import Header from "../header/page";
import { saveOrder } from "@/redux/reducers/orderHistoryReducer";
import Script from "next/script";
import { useRouter } from "next/navigation"; 

declare global {
  interface Window{
    Razorpay: any;
  }
}


const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState("");
  const [deliveryDate, setDeliveryDate] = useState(
    new Date().toISOString().split("T")[0] // Today's date as default
  );

  const cities = [
    { name: "Hyderabad", deliveryPoints: ["JNTU", "MG Bus Stand", "Miyapur"] },
    { name: "Chennai", deliveryPoints: ["Koyambedu", "Tambaram", "Guindy"] },
    { name: "Bangalore", deliveryPoints: ["Majestic", "KR Market", "Electronic City"] },
  ];

  const handleCityChange = (city) => {
    setSelectedCity(city);
    const cityData = cities.find((c) => c.name === city);
    setSelectedDeliveryPoint("");
  };

  const handlePlaceOrder = async () => {
    if (!customerName || !mobileNumber || !selectedCity || !selectedDeliveryPoint) {
      alert("Please fill all the delivery details.");
      return;
    }

    // Prepare the order object
    const orderDetails = {
      cartItems: cart,
      deliveryDetails: {
        customerName,
        mobileNumber,
        city: selectedCity,
        deliveryPoint: selectedDeliveryPoint,
        deliveryDate,
      },
      sellerPhone: "9989325599",
      totalPrice,
      orderDate: new Date().toISOString(),
    };
    try {
      const response = await fetch("https://api.maruthi-sweets.com/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      const data = await response.json();
      if (data.message === "Order placed successfully.") {
        console.log("Order placed successfully:", data.order);
        dispatch(saveOrder(orderDetails)); // Dispatch action to save order in Redux
        // Clear the cart
        cart.forEach((item) => dispatch(removeItemFromCart(item.name)));
        alert("Order placed successfully!");
        router.push("/history");
      } else {
        console.error("Error placing order:", data.message);
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };



  const [isProcessing, setIsProcessing] = useState(false);
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        body: JSON.stringify({ amount: totalPrice }),
      });
      const data = await response.json();
      interface RazorpayOptions {
        key: string;
        amount: number;
        currency: string;
        name: string;
        description: string;
        order_id: string;
        handler: (response: RazorpayResponse) => Promise<void>;
        prefill: {
          name: string;
          contact: string;
        };
        theme: {
          color: string;
        };
      }

      interface RazorpayResponse {
        razorpay_payment_id: string;
        razorpay_signature: string;
      }

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: totalPrice * 100,
        currency: "INR",
        name: "Sri Maruthi Sweets",
        description: "Payment for sweets",
        order_id: data.orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const paymentVerificationResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });
            const paymentData = await paymentVerificationResponse.json();
            if (paymentData.message === "Payment successful") {
              alert("Payment successful");
              handlePlaceOrder();
            } else {
              alert("Payment failed. Please try again.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("Failed to verify payment. Please try again.");
          }
        },
        prefill: {
          name: customerName,
          contact: mobileNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) { 
      console.error("payment failed:", error);
      alert("payment failed. Please try again.");
    } finally{
      setIsProcessing(false);
    }
  }

  return (
    <div>
      <Header />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="mb-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-white p-4 rounded shadow mb-4"
                >
                  <p className="font-semibold">{item.name}</p>
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => dispatch(updateItemQuantity(item, item.quantity - 1))}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="px-2 py-1 bg-red-500 text-white rounded"
                      onClick={() => dispatch(updateItemQuantity(item, item.quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-6 rounded shadow mb-6">
              <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded"
              />
              <select
                value={selectedCity}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full mb-4 px-3 py-2 border rounded"
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.name} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {selectedCity && (
                <select
                  value={selectedDeliveryPoint}
                  onChange={(e) => setSelectedDeliveryPoint(e.target.value)}
                  className="w-full mb-4 px-3 py-2 border rounded"
                >
                  <option value="">Select Delivery Point</option>
                  {cities
                    .find((city) => city.name === selectedCity)
                    ?.deliveryPoints.map((point) => (
                      <option key={point} value={point}>
                        {point}
                      </option>
                    ))}
                </select>
              )}
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-6">
              <span>Total:</span>
              <span className="font-semibold">Rs. {totalPrice}</span>
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-3 bg-blue-600 text-white rounded-lg"
            >
              Place Order
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
