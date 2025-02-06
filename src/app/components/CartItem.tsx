// components/CartItem.tsx
import { useDispatch } from "react-redux";
import { removeItemFromCart, updateItemQuantity } from "../../redux/actions/cartActions";

interface CartItemProps {
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

const CartItem = (cartItem: CartItemProps) => {
  const { product_id, product_name, product_price, quantity } = cartItem
  const dispatch = useDispatch();
    const handleIncreaseQuantity = () => {
        if (cartItem) {
          dispatch(updateItemQuantity({ product_id, product_name, product_price, quantity }, quantity + 1));
        }
    };

    const handleDecreaseQuantity = () => {
        if (cartItem && cartItem.quantity === 1) {
            dispatch(removeItemFromCart(product_name));
        } else if (cartItem) {
          dispatch(updateItemQuantity({ product_id, product_name, product_price, quantity }, quantity - 1));
        }
    };
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-4">
      <p className="font-semibold">{product_name}</p>
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 bg-red-500 text-white rounded"
          onClick={handleDecreaseQuantity}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded"
          onClick={handleIncreaseQuantity}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
