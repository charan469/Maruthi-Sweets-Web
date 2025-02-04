// /redux/reducers/customerReducer.ts

import { SAVE_CUSTOMER } from '../actions/customerActions';

interface CustomerState {
  name: string;
  mobile_number: string;
}

const initialState: CustomerState = {
  name: "",
  mobile_number: "",
};

interface SaveCustomerAction {
  type: typeof SAVE_CUSTOMER;
  payload: CustomerState;
}

type CustomerActionTypes = SaveCustomerAction;

const customerReducer = (state = initialState, action: CustomerActionTypes) => {
  switch (action.type) {
    case SAVE_CUSTOMER:
      return {
        ...state,
        name: action.payload.name,
        mobile_number: action.payload.mobile_number,
      };

    default:
      return state;
  }
};

export default customerReducer;
