import request from "@utils/request";

export const getCoupons = () => {
  return request({
    url: "/admin/coupons",
    method: "get",
  });
};

export const addCoupon = (data) => {
  return request({
    url: `/admin/coupon`,
    method: "post",
    data,
  });
};

export const updateCoupon = (data, id) => {
  return request({
    url: `/admin/coupon/${id}`,
    method: "put",
    data,
  });
};
export const deleteCoupon = (id) =>
  request({
    url: `/admin/coupon/${id}`,
    method: "delete",
  });
