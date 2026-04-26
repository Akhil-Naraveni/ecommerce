import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartSummaryReducer from "./cartSummarySlice";
import productSearchReducer from "./productSearchSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cartSummary: cartSummaryReducer,
    productSearch: productSearchReducer,
  },
});
