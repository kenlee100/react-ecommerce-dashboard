import request from "@utils/request";

export const getOrders = (query) => {
  const searchParams = new URLSearchParams(query);
  return request({
    url: `/admin/orders?${searchParams.toString()}`,
    method: "get",
  });
};

export const updateOrder = (data, id) => {
  return request({
    url: `/admin/order/${id}`,
    method: "put",
    data,
  });
};
export const deleteOrder = (id) =>
  request({
    url: `/admin/order/${id}`,
    method: "delete",
  });
