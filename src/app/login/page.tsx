"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux"; // Import useDispatch from redux
import Header from "../header/page"; // Adjust the path if necessary
import { saveCustomer } from "../../redux/actions/customerActions"; // Import the action

export default function Login() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();
  const dispatch = useDispatch(); // Initialize dispatch

  // const handleGetOtp = () => {
  //   if (name && phone.length === 10) {
  //     // Dispatch the action to save customer details in Redux
  //     dispatch(saveCustomer({ name, mobile_number: phone }));
  //     // Navigate to OTP page (or next page)
  //     router.push(`/otp?name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`);
  //   } else {
  //     alert("Enter a valid name and 10-digit phone number.");
  //   }
  // };

  
  const handleNext = () => {
    if (name && phone.length === 10) {
      // Dispatch the action to save customer details in Redux
      dispatch(saveCustomer({ name, mobile_number: phone }));
      router.push("/home");
   
    } else {
      alert("Enter a valid name and 10-digit phone number.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header showIcons={false} />

      <div className="flex items-center justify-center px-4 py-6">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6 text-teal-600">Login</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Enter Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">Enter Mobile Number</label>
            <input
              type="number"
              placeholder="Enter Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          {/* <button
            onClick={handleGetOtp}
            className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Get OTP
          </button> */}
          <button
            onClick={handleNext}
            className="w-full py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
