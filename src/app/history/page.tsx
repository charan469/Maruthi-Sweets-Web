"use client";

import React from "react";
import { useSelector } from "react-redux";
import Header from "../header/page";

const OrderHistoryPage = () => {
    // Access order history from Redux store
    const orderHistory = useSelector((state: any) => state.orderHistory.orderHistory);

    return (
        <div>
            <Header />
            <div className="history-container">
                <h1 className="text-2xl font-bold mb-4">Your Order History</h1>
                {orderHistory.length === 0 ? (
                    <p className="empty-text">No orders found.</p>
                ) : (
                    <div className="history-list">
                        {orderHistory.map((item: any, index: number) => (
                            <div key={index} className="order-card">
                                <p className="order-date">
                                    <strong>Order Date:</strong> {new Date(item.orderDate).toLocaleString()}
                                </p>
                                <p className="customer-name">
                                    <strong>Customer:</strong> {item.deliveryDetails.customerName}
                                </p>
                                <p>
                                    <strong>Delivery Address:</strong> {item.deliveryDetails.city},{" "}
                                    {item.deliveryDetails.deliveryPoint}
                                </p>
                                <p>
                                    <strong>Delivery Date:</strong> {item.deliveryDetails.deliveryDate}
                                </p>
                                <p>
                                    <strong>Seller Contact:</strong> {item.sellerPhone}
                                </p>
                                <div className="cart-items">
                                    {item.cartItems.map((cartItem: any, cartIndex: number) => (
                                        <p key={cartIndex}>
                                            {cartItem.name} x {cartItem.quantity} = Rs.{" "}
                                            {cartItem.price * cartItem.quantity}
                                        </p>
                                    ))}
                                </div>
                                <p className="total-price">
                                    <strong>Total Price:</strong> Rs. {item.totalPrice}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistoryPage;
