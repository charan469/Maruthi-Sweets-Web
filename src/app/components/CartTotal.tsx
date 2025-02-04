// components/CartTotal.tsx
interface CartTotalProps {
    totalPrice: number;
  }
  
  const CartTotal = ({ totalPrice }: CartTotalProps) => {
    return (
      <div className="flex justify-between items-center bg-white p-4 rounded shadow mb-6">
        <span>Total:</span>
        <span className="font-semibold">Rs. {totalPrice}</span>
      </div>
    );
  };
  
  export default CartTotal;
  