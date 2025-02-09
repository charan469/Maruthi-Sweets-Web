"use client"
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeItemFromCart } from "../../redux/actions/cartActions";
import { saveOrder } from "@/redux/reducers/orderHistoryReducer";
import Header from "../header/page";
import Script from "next/script";
import { useRouter } from "next/navigation";
import CartItem from "../components/CartItem";
import DeliveryDetails from "../components/DeliveryDetails";
import CartTotal from "../components/CartTotal";
import PlaceOrderButton from "../components/PlaceOrderButton";
import Loader from "../components/Loader"; // Import the loader component
import Link from 'next/link';

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

interface RootState {
  customer: { name: string; mobile_number: string };
  cart: { cart: { product_id: string; product_name: string; product_price: number; product_image_url: string; quantity: number; }[] };
}
const Cart = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const customer = useSelector((state: RootState) => state.customer);
  const cart = useSelector((state: RootState) => state.cart.cart) || [];
  const [deliveryCharges, setDeliveryCharges] = useState(0)
  const itemsPrice = cart.reduce((total, item) => total + item.product_price * item.quantity, 0);
  const totalPrice = itemsPrice + deliveryCharges;

  const [customerName, setCustomerName] = useState(customer.name);
  const [mobileNumber, setMobileNumber] = useState(customer.mobile_number);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDeliveryPoint, setSelectedDeliveryPoint] = useState("");

  const getMinDeliveryDate = () => {
    const now = new Date();
    now.setHours(now.getHours() + 48); // Add 48 hours

    // Adjust to the next morning (8:00 AM)
    if (now.getHours() >= 8) {
      now.setDate(now.getDate() + 1);
    }
    now.setHours(8, 0, 0, 0); // Set time to 8 AM

    return now.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
  };
  const [deliveryDate, setDeliveryDate] = useState(getMinDeliveryDate());
  const cities = [
    { name: "Hyderabad", deliveryPoints: ["JNTU", "MG Bus Stand", "Miyapur"], deliveryCharges: 100 },
    { name: "Chennai", deliveryPoints: ["Koyambedu", "Tambaram", "Guindy"], deliveryCharges: 150 },
    { name: "Bangalore", deliveryPoints: ["Majestic", "KR Market", "Electronic City"], deliveryCharges: 200 },
  ];


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
      orderStatus: "New Order",
    };
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      const data = await response.json();
      if (data.message === "Order placed successfully.") {
        console.log("Order placed successfully:", data.order);
        dispatch(saveOrder(orderDetails)); // Dispatch action with correct structure
        cart.forEach((item) => dispatch(removeItemFromCart(item.product_name)));
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
              //alert("Payment successful");
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
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div>
      <Header />
      <div className="p-6 bg-gray-50 min-h-screen relative">
        <h1 className="text-2xl font-bold mb-4">Cart</h1>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-center text-gray-600">Your cart is empty.</p>
            <Link href="/home">
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all">
               Go to Home
              </button>
            </Link>
          </div>


        ) : (
          <>
            <div className="mb-6">
              {cart.map((item) => (
                <CartItem key={item.product_id} {...item} />
              ))}
            </div>
            <DeliveryDetails
              customerName={customerName}
              mobileNumber={mobileNumber}
              selectedCity={selectedCity}
              selectedDeliveryPoint={selectedDeliveryPoint}
              deliveryDate={deliveryDate}
              getMinDeliveryDate={getMinDeliveryDate}
              setCustomerName={setCustomerName}
              setMobileNumber={setMobileNumber}
              setSelectedCity={setSelectedCity}
              setSelectedDeliveryPoint={setSelectedDeliveryPoint}
              setDeliveryDate={setDeliveryDate}
              cities={cities}
              deliveryCharges={deliveryCharges}
              setDeliveryCharges={setDeliveryCharges}
              itemsPrice={itemsPrice}
            />
            <CartTotal totalPrice={totalPrice} />
            <PlaceOrderButton handlePayment={handlePayment} isProcessing={isProcessing} />
          </>
        )}

        {/* Show loader when isProcessing is true */}
        {isProcessing && <Loader />}
      </div>
    </div>
  );
};

export default Cart;
