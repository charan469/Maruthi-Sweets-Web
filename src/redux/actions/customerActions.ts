
export const SAVE_CUSTOMER = "SAVE_CUSTOMER";

export const saveCustomer = (customerDetails: { name: string; mobile_number: string }) => {
  return {
    type: SAVE_CUSTOMER,
    payload: customerDetails,
  };
};
