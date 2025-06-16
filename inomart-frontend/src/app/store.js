//import store
import { configureStore } from "@reduxjs/toolkit";
import productDetail from "../features/productDetailSlice";

export const store = configureStore({
  reducer: {
    app: productDetail,
  },
});
