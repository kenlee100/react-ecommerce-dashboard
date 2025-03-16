import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getCoupons,
  updateCoupon,
  deleteCoupon,
  addCoupon,
} from "@apis/coupon";

import { pushMessage } from "@/redux/toastSlice";

import {
  setIsLoading,
  errorMessage,
  setModalModifySuccess,
} from "@/redux/commonSlice";

export const couponSlice = createSlice({
  name: "couponSlice",
  initialState: {
    coupons: [],
    pageInfo: {
      total_pages: 1,
      current_page: 1,
      has_pre: false,
      has_next: true,
      category: "",
    },
  },
  reducers: {
    setCoupons(state, action) {
      state.coupons = action.payload;
    },
    setPageInfo: (state, action) => {
      state.pageInfo = action.payload;
    },
  },
});

export const asyncCouponsData = createAsyncThunk(
  "couponSlice/getCoupons",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await getCoupons(content);
      const { coupons, pagination } = res;
      await dispatch(setCoupons(coupons));
      await dispatch(setPageInfo(pagination));
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
);

export const asyncUpdateCoupon = createAsyncThunk(
  "couponSlice/updateCoupon",
  async (content, { dispatch }) => {
    try {
      const res = await updateCoupon(content, content.data.id);
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${content.data?.id}：${res.message}`,
          status: "success",
        })
      );
      await dispatch(
        asyncCouponsData({
          page: 1,
        })
      );
    } catch (error) {
      dispatch(pushMessage(errorMessage(error)));
      console.error(error);
    }
  }
);

export const asyncDeleteCouponData = createAsyncThunk(
  "couponSlice/deleteCoupon",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await deleteCoupon(content.data.id);
      const { message } = res;
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${content.data?.id}：${message}`,
          status: "success",
        })
      );
      await dispatch(
        asyncCouponsData({
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

export const asyncAddCoupon = createAsyncThunk(
  "couponSlice/addCoupon",
  async (content, { dispatch }) => {
    dispatch(setIsLoading(true));
    try {
      const res = await addCoupon(content);
      const { message } = res;
      await dispatch(setModalModifySuccess(true));
      await dispatch(
        pushMessage({
          text: `${message}：${content.data?.title}`,
          status: "success",
        })
      );

      await dispatch(
        asyncCouponsData({
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

export const { setCoupons, setPageInfo } = couponSlice.actions;

export const selectCoupons = (state) => state.couponSlice.coupons;
export const selectPageInfo = (state) => state.couponSlice.pageInfo;

export default couponSlice.reducer;
