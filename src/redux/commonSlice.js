import { createSlice } from "@reduxjs/toolkit";

export const errorMessage = (error) => {
  return {
    text: error?.response?.data?.message || "錯誤",
    status: "failed",
  };
};
export const commonSlice = createSlice({
  name: "commonSlice",
  initialState: {
    isLoading: false,
    modalModifySuccess: false, // 是否新增/修改成功
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setModalModifySuccess: (state, action) => {
      state.modalModifySuccess = action.payload;
    },
  },
});

export const { setIsLoading, setModalModifySuccess, setOrders } =
  commonSlice.actions;

export const selectLoading = (state) => state.commonSlice.isLoading;

export const selectModalModifySuccess = (state) =>
  state.commonSlice.modalModifySuccess;
export default commonSlice.reducer;
