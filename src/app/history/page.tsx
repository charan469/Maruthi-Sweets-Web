"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Header from "../header/page";
import { useSelector } from "react-redux";
import Image from "next/image";

interface Order {
    order_id: string;
    order_date: string;
    name: string;
    city: string;
    delivery_point: string;
    delivery_date: string;
    mobile_number: string;
    cart_items: {
        product_name: string;
        quantity: number;
        product_price: number;
        product_image_url: string;
    }[];
    total_price: number;
    order_status: string;
}

// Define the shape of your Redux store's state
interface RootState {
    customer: {
        mobile_number: string;
    };
}

const OrderHistory: React.FC = () => {
    const customer = useSelector((state: RootState) => state.customer);
    const [orderHistory, setOrderHistory] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        if (!customer?.mobile_number) return;

        try {
            const url = `${process.env.NEXT_PUBLIC_BASE_URL}get-customer-orders`;
            const response = await axios.get(url, {
                headers: { "Cache-Control": "no-cache" },
                params: { mobileNumber: customer.mobile_number },
            });
            setOrderHistory(response.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Failed to fetch orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    }, [customer.mobile_number]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    if (loading) return <div style={styles.loadingText}>Loading...</div>;
    if (error) return <div style={styles.errorText}>{error}</div>;
        // const handleDeleteAll = async () => {
    //     const confirmDelete = window.confirm("Are you sure you want to delete all orders and customers?");
    //     if (!confirmDelete) return;

    //     try {
    //       const response = await axios.delete("http://localhost:5000/api/delete-all");
    //       alert(response.data.message);
    //       fetchOrders(); // Refresh orders after deletion
    //     } catch (error) {
    //       console.error("Error deleting all data:", error);
    //       alert("Failed to delete orders and customers.");
    //     }
    //   };

    return (
        <div style={styles.container}>
            <Header />
            {/* <button onClick={handleDeleteAll} style={{ background: "red", color: "white", padding: "10px", cursor: "pointer" }}>
        Delete All Orders & Customers
      </button> */}
            {orderHistory.length === 0 ? (
                <p style={styles.emptyText}>No orders found.</p>
            ) : (
                orderHistory.map((order) => (
                    <div key={order.order_id} style={styles.orderCard}>
                        <p style={styles.orderDate}>Order Id: {order.order_id}</p>
                        <p style={styles.orderDate}>
                            Order Date: {new Date(order.order_date).toLocaleString()}
                        </p>
                        <p style={styles.customerName}>Customer Name: {order.name}</p>
                        <p>Delivery Address: {order.city}, {order.delivery_point}</p>
                        <p>Delivery Date: {order.delivery_date}</p>
                        <p>Order Status: <strong>{order.order_status}</strong></p>
                        <p>Customer Contact: {order.mobile_number}</p>

                        <div>
                            <strong>Items:</strong>
                            {order.cart_items.map((item, idx) => (
                                <div key={idx} style={styles.itemRow}>
                                    <Image
                                        src={item.product_image_url}
                                        alt={item.product_name}
                                        width={50}
                                        height={50}
                                        style={{ borderRadius: "8px" }}
                                        unoptimized
                                    />
                                    <p>
                                        {item.product_name} x {item.quantity} = Rs.{" "}
                                        {item.product_price * item.quantity}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <p style={styles.totalPrice}>Total Price: Rs. {order.total_price}</p>
                    </div>
                ))
            )}
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        padding: "10px",
    },
    loadingText: {
        textAlign: "center",
        fontSize: "18px",
        color: "blue",
    },
    errorText: {
        textAlign: "center",
        fontSize: "18px",
        color: "red",
    },
    emptyText: {
        textAlign: "center",
        fontSize: "18px",
        color: "gray",
    },
    orderCard: {
        padding: "15px",
        margin: "15px 0",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    orderDate: {
        fontSize: "14px",
        fontWeight: "bold",
        marginBottom: "5px",
    },
    customerName: {
        fontSize: "16px",
        marginBottom: "5px",
    },
    totalPrice: {
        fontSize: "16px",
        fontWeight: "bold",
        marginTop: "10px",
    },
    itemRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "5px",
    },
};

export default OrderHistory;
