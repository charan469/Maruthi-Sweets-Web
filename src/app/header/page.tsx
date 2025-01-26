import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import hanumanLogo from "../../../assets/hanuman-logo.png";
import {  useSelector } from 'react-redux';
import { History, ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
    const cart = useSelector((state) => state.cart.cart);

    return (
        <header className="flex items-center justify-between px-4 py-3 bg-white shadow-md">
            <div className="flex items-center space-x-4">
                <Image
                    src={hanumanLogo}
                    alt="Hanuman Logo"
                    width={30}
                    height={30}
                /> <nav>
                        <Link href="/home">
                <h1 className="text-2xl font-semibold">Sri Maruthi Sweets</h1>
                </Link>
            </nav>
            </div>
            <div className="flex items-center space-x-4">
                <nav>
                    <Link href="/history">
                        <History className="cursor-pointer" />
                    </Link>
                </nav>
                <div className="relative">
                    <nav>
                        <Link href="/cart">
                            <ShoppingCart className="cursor-pointer" />
                        </Link>
                    </nav>
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cart.reduce((total, item) => total + item.quantity, 0)}
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;