// /redux/reducers/cartReducer.ts

import { ADD_ITEM, REMOVE_ITEM, UPDATE_QUANTITY } from '../actions/cartActions';

interface CartItem {
  product_name: string;
  quantity: number;
}

interface CartState {
  cart: CartItem[];
}

const initialState: CartState = {
  cart: [],
};

const cartReducer = (state = initialState, action: { type: string; payload: CartItem | string | { item: CartItem; quantity: number } }) => {
  switch (action.type) {
    case ADD_ITEM:
      const itemIndex = state.cart.findIndex(item => item.product_name === (action.payload as CartItem).product_name);
      if (itemIndex >= 0) {
        // Item exists, update quantity
        const updatedCart = [...state.cart];
        updatedCart[itemIndex].quantity += 1;
        return { ...state, cart: updatedCart };
      } else {
        // Item doesn't exist, add to cart with quantity 1
        return { ...state, cart: [...state.cart, { ...(action.payload as CartItem), quantity: 1 }] };
      }

    case REMOVE_ITEM:
      return { ...state, cart: state.cart.filter(item => item.product_name !== action.payload) };

    case UPDATE_QUANTITY:
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product_name === (action.payload as { item: CartItem; quantity: number }).item.product_name
            ? { ...item, quantity: (action.payload as { item: CartItem; quantity: number }).quantity }
            : item
        ),
      };

    default:
      return state;
  }
};

export default cartReducer;
