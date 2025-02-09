"use client"; // Next.js-specific directive
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, updateItemQuantity, removeItemFromCart } from "../../redux/actions/cartActions";
import Header from "../header/page";
import axios from "axios";
import Image from "next/image";

interface Product {
    product_id: number;
    product_name: string;
    product_price: number;
    product_image_url: string;
}

interface CartItem {
    product_name: string;
    quantity: number;
    product_price: number;
    product_image_url: string;
}

const Home = () => {
    const dispatch = useDispatch();
    const customer = useSelector((state: { customer: { name: string; mobile_number: string } }) => state.customer);
    const cart = useSelector((state: { cart: { cart: CartItem[] } }) => state.cart.cart);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAvailableProducts = async () => {
            try {
                const url = process.env.NEXT_PUBLIC_BASE_URL + "get-available-products";
                const response = await axios.get(url, {
                    headers: { "Cache-Control": "no-cache" },
                });
                setAvailableProducts(response.data);
            } catch (err) {
                console.error("Error fetching available products:", err);
                setError("Failed to fetch available products. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        fetchAvailableProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const handleAddItem = (product: Product) => dispatch(addItemToCart(product));
    const handleIncreaseQuantity = (product: Product) => {
        const cartItem = cart.find(item => item.product_name === product.product_name);
        if (cartItem) dispatch(updateItemQuantity(cartItem, cartItem.quantity + 1));
    };
    const handleDecreaseQuantity = (product: Product) => {
        const cartItem = cart.find(item => item.product_name === product.product_name);
        if (cartItem) {
            if (cartItem.quantity === 1) {
                dispatch(removeItemFromCart(product.product_name));
            } else {
                dispatch(updateItemQuantity(cartItem, cartItem.quantity - 1));
            }
        }
    };
    

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="px-4 py-6">
                <h2 className="text-xl font-semibold mb-4">Hi {customer.name}</h2>
                <h2 className="text-xl font-semibold text-center mb-4">Our Sweets</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {availableProducts.map(product => {
                        const cartItem = cart.find(item => item.product_name === product.product_name);
                        return (
                            <div key={product.product_id} className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex items-center justify-center">
                                    <div className="w-32 h-32">
                                        <Image src={product.product_image_url} alt={product.product_name}  className="w-full h-full object-cover rounded" width={50} height={50} layout="fixed"/>
                                    </div>
                                </div>
                                <h3 className="text-sm font-semibold mt-2 text-center">{product.product_name}</h3>
                                <p className="text-teal-600 font-bold text-center">Rs. {product.product_price}</p>
                                {cartItem ? (
                                    <div className="flex justify-center items-center mt-4 space-x-2">
                                        <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleDecreaseQuantity(product)}>-</button>
                                        <span>{cartItem.quantity}</span>
                                        <button className="px-2 py-1 bg-red-500 text-white rounded" onClick={() => handleIncreaseQuantity(product)}>+</button>
                                    </div>
                                ) : (
                                    <button className="mt-4 w-full py-2 bg-orange-600 text-white rounded-lg" onClick={() => handleAddItem(product)}>Add to Cart</button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default Home;
