// components/CartItem.tsx
import { useDispatch } from "react-redux";
import { updateItemQuantity } from "../../redux/actions/cartActions";

interface CartItemProps {
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

const CartItem = ({ product_id, product_name, product_price, quantity }: CartItemProps) => {
  const dispatch = useDispatch();

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-4">
      <p className="font-semibold">{product_name}</p>
      <div className="flex items-center space-x-2">
        <button
          className="px-2 py-1 bg-red-500 text-white rounded"
          onClick={() => dispatch(updateItemQuantity({ product_id, product_name, product_price, quantity }, quantity - 1))}
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          className="px-2 py-1 bg-red-500 text-white rounded"
          onClick={() => dispatch(updateItemQuantity({ product_id, product_name, product_price, quantity }, quantity + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CartItem;
