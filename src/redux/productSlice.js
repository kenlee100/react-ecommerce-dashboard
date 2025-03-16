import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  addProducts,
  getProducts,
  updateProduct,
  deleteProduct,
} from "@apis/product";

import { pushMessage } from "@/redux/toastSlice";
import {
  setIsLoading,
  errorMessage,
  setModalModifySuccess,
} from "@/redux/commonSlice";

export const productSlice = createSlice({
  name: "productSlice",
  initialState: {
    products: [],
    pageInfo: {
      total_pages: 1,
      current_page: 1,
      has_pre: false,
      has_next: true,
      category: "",
    },
  },
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setPageInfo: (state, action) => {
      state.pageInfo = action.payload;
    },
  },
});

export const asyncProductsData = createAsyncThunk(
  "productSlice/getProductsData",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await getProducts(content);
      const { products, pagination } = res;
      await dispatch(setProducts(products));
      await dispatch(setPageInfo(pagination));
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const asyncUpdateProduct = createAsyncThunk(
  "productSlice/updateProduct",
  async (content, { dispatch }) => {
    try {
      const res = await updateProduct(content, content.data.id);
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${res.message}：${content.data?.title}`,
          status: "success",
        })
      );
      await dispatch(
        asyncProductsData({
          page: 1,
        })
      );
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    }
  }
);

export const asyncDeleteProductData = createAsyncThunk(
  "productSlice/deleteProduct",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await deleteProduct(content.data.id);
      const { message } = res;
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${message}：${content.data?.title}`,
          status: "success",
        })
      );

      await dispatch(
        asyncProductsData({
          page: 1,
        })
      );
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const asyncAddProduct = createAsyncThunk(
  "productSlice/addProducts",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await addProducts(content);
      const { message } = res;
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${message}：${content.data?.title}`,
          status: "success",
        })
      );

      await dispatch(
        asyncProductsData({
          page: 1,
        })
      );
    } catch (error) {
      await dispatch(pushMessage(errorMessage(error)));
      await dispatch(setModalModifySuccess(false));
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const { setProducts, setPageInfo } = productSlice.actions;

export const selectProducts = (state) => state.productSlice.products;
export const selectPageInfo = (state) => state.productSlice.pageInfo;

export default productSlice.reducer;
