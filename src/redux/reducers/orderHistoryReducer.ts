

interface OrderDetails {
  cartItems: {
    product_name: string;
    quantity: number;
    product_price: number;
    product_image_url: string;
  }[];
  deliveryDetails: {
    customerName: string;
    mobileNumber: string;
    city: string;
    deliveryPoint: string;
    deliveryDate: string;
  };
  sellerPhone: string;
  totalPrice: number;
  orderDate: string;
  orderStatus: string;
}

interface OrderState {
  orderHistory: OrderDetails[];
}

interface SaveOrderAction {
  type: typeof SAVE_ORDER;
  payload: OrderDetails;
}

type OrderActions = SaveOrderAction;

const SAVE_ORDER = "SAVE_ORDER";

export const saveOrder = (orderDetails: OrderDetails) => {
  return {
    type: SAVE_ORDER,
    payload: orderDetails,
  };
};


const initialState: OrderState = {
  orderHistory: [],
};

const orderHistoryReducer = (state = initialState, action: OrderActions): OrderState => {
  switch (action.type) {
    case SAVE_ORDER:
      return {
        ...state,
        orderHistory: [...state.orderHistory, action.payload],
      };

    default:
      return state;
  }
};

export default orderHistoryReducer;
