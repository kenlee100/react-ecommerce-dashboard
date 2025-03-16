import { createSlice, isAnyOf } from "@reduxjs/toolkit";

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
  // extraReducers: (builder) => {
  //   // addMatcher：可以把多個非同步組合在一起。要搭配 isAnyOf
  //   // addCase：一次加一個
  //   // 控制 admin loading
  //   // builder.addMatcher(
  //   //   isAnyOf(
  //   //     asyncProductsData.fulfilled,
  //   //     asyncUpdateProduct.fulfilled,
  //   //     asyncDeleteProductData.fulfilled
  //   //   ),
  //   //   (state) => {
  //   //     state.isLoading = false;
  //   //   }
  //   // );
  //   // builder.addMatcher(
  //   //   isAnyOf(
  //   //     asyncUpdateProduct.pending,
  //   //     asyncProductsData.pending,
  //   //     asyncDeleteProductData.pending
  //   //   ),
  //   //   (state) => {
  //   //     state.isLoading = true;
  //   //   }
  //   // );
  //   // builder.addMatcher(
  //   //   isAnyOf(
  //   //     asyncUpdateProduct.rejected,
  //   //     asyncProductsData.rejected,
  //   //     asyncDeleteProductData.rejected
  //   //   ),
  //   //   (state) => {
  //   //     state.isLoading = false;
  //   //   }
  //   // );
  // },
});

export const { setIsLoading, setModalModifySuccess, setOrders } =
  commonSlice.actions;

export const selectLoading = (state) => state.commonSlice.isLoading;

export const selectModalModifySuccess = (state) =>
  state.commonSlice.modalModifySuccess;
export default commonSlice.reducer;
