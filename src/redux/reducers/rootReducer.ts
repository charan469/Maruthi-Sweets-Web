// /redux/reducers/rootReducer.ts

import { combineReducers } from "redux";
import cartReducer from "./cartReducer";
import orderHistoryReducer from "./orderHistoryReducer";
import customerReducer from "./customerReducer";

const rootReducer = combineReducers({
  cart: cartReducer,
  orderHistory: orderHistoryReducer,
  customer: customerReducer, // Add customer reducer
});

export default rootReducer;
