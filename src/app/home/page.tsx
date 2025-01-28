"use client"; // Next.js-specific directive
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, updateItemQuantity, removeItemFromCart } from "../../redux/actions/cartActions";
import { ShoppingCart, History } from "lucide-react";
import Image from "next/image";
import putharekuluImage from "../../../assets/putharekulu-box-sample.png";
import putharekuluImage2 from "../../../assets/putharekulu-box-sample2.png";
import Link from "next/link";
import Header from "../header/page";

const products = [
    { id: 1, name: "Bellam Dry Fruits Putharekulu [8 Pcs]", price: 150, image: putharekuluImage },
    { id: 2, name: "Panchadhara Dry Fruits Putharekulu [8 Pcs]", price: 150, image: putharekuluImage2 },
    { id: 3, name: "Boost Putharekulu", price: 180, image: putharekuluImage },
];
//empty commit
const Home = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.cart);

    const handleAddItem = (product) => {
        dispatch(addItemToCart(product));
    };

    const handleIncreaseQuantity = (product) => {
        const cartItem = cart.find((item) => item.name === product.name);
        if (cartItem) {
            dispatch(updateItemQuantity(cartItem, cartItem.quantity + 1));
        }
    };

    const handleDecreaseQuantity = (product) => {
        const cartItem = cart.find((item) => item.name === product.name);
        if (cartItem.quantity === 1) {
            dispatch(removeItemFromCart(product.name));
        } else {
            dispatch(updateItemQuantity(cartItem, cartItem.quantity - 1));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <Header/>

            {/* Product List */}
            <main className="px-4 py-6">
                <h2 className="text-xl font-semibold text-center mb-4">Our Sweets</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {products.map((product) => {
                        const cartItem = cart.find((item) => item.name === product.name);
                        return (
                            <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
                                <div className="flex items-center justify-center">
                                    <div className="w-32 h-32 ">
                                        {/* Set fixed dimensions for the image container */}
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    </div>
                                </div>
                                <h3 className="text-sm font-semibold mt-2 text-center">{product.name}</h3>
                                <p className="text-teal-600 font-bold text-center">Rs. {product.price}</p>
                                {cartItem ? (
                                    <div className="flex justify-center items-center mt-4 space-x-2">
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded"
                                            onClick={() => handleDecreaseQuantity(product)}
                                        >
                                            -
                                        </button>
                                        <span>{cartItem.quantity}</span>
                                        <button
                                            className="px-2 py-1 bg-red-500 text-white rounded"
                                            onClick={() => handleIncreaseQuantity(product)}
                                        >
                                            +
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="mt-4 w-full py-2 bg-orange-600 text-white rounded-lg"
                                        onClick={() => handleAddItem(product)}
                                    >
                                        Add to Cart
                                    </button>
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
