import { configureStore } from "@reduxjs/toolkit";
import commonReducer from "@/redux/commonSlice";
import toastReducer from "@/redux/toastSlice";
import productReducer from "@/redux/productSlice";
import couponReducer from "@/redux/couponSlice";
import orderReducer from "@/redux/orderSlice";

export const store = configureStore({
  reducer: {
    commonSlice: commonReducer,
    couponSlice: couponReducer,
    productSlice: productReducer,
    toast: toastReducer,
    orderSlice: orderReducer,
  },
});
