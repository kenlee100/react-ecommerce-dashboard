import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { getOrders, updateOrder, deleteOrder } from "@apis/order";
import { pushMessage } from "@/redux/toastSlice";

import {
  setIsLoading,
  errorMessage,
  setModalModifySuccess,
} from "@/redux/commonSlice";

export const orderSlice = createSlice({
  name: "orderSlice",
  initialState: {
    orders: [],
    pageInfo: {
      total_pages: 1,
      current_page: 1,
      has_pre: false,
      has_next: true,
      category: "",
    },
  },
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    setPageInfo: (state, action) => {
      state.pageInfo = action.payload;
    },
  },
});

export const asyncOrdersData = createAsyncThunk(
  "orderSlice/getOrders",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await getOrders(content);
      const { orders, pagination } = res;
      await dispatch(setOrders(orders));
      await dispatch(setPageInfo(pagination));
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const asyncUpdateOrder = createAsyncThunk(
  "orderSlice/updateOrder",
  async (content, { dispatch }) => {
    try {
      const res = await updateOrder(content, content.data.id);
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${content.data?.id}：${res.message}`,
          status: "success",
        })
      );
      await dispatch(
        asyncOrdersData({
          page: 1,
        })
      );
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    }
  }
);

export const asyncDeleteOrderData = createAsyncThunk(
  "commonSlice/deleteOrder",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await deleteOrder(content.data.id);
      const { message } = res;
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${content.data?.id}：${message}`,
          status: "success",
        })
      );
      await dispatch(
        asyncOrdersData({
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
export const { setOrders, setPageInfo } = orderSlice.actions;

export const selectOrders = (state) => state.orderSlice.orders;
export const selectPageInfo = (state) => state.orderSlice.pageInfo;

export default orderSlice.reducer;
