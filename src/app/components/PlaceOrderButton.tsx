// components/PlaceOrderButton.tsx
interface PlaceOrderButtonProps {
    handlePayment: () => void;
    isProcessing: boolean;
  }
  
  const PlaceOrderButton = ({ handlePayment, isProcessing }: PlaceOrderButtonProps) => {
    return (
      <button
        onClick={handlePayment}
        className="w-full py-3 bg-blue-600 text-white rounded-lg"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Place Order"}
      </button>
    );
  };
  
  export default PlaceOrderButton;
  