import request from "@utils/request";

export const getProducts = (query) => {
  const searchParams = new URLSearchParams(query);
  return request({
    url: `/admin/products?${searchParams.toString()}`,
    method: "get",
  });
};
export const getProductsAll = () =>
  request({
    url: `/admin/products/all`,
    method: "get",
  });
export const addProducts = (data) => {
  return request({
    url: `/admin/product`,
    method: "post",
    data,
  });
};
export const updateProduct = (data, id) => {
  return request({
    url: `/admin/product/${id}`,
    method: "put",
    data,
  });
};
export const deleteProduct = (id) =>
  request({
    url: `/admin/product/${id}`,
    method: "delete",
  });
export const uploadImage = (data) => {
  return request({
    url: `/admin/upload`,
    method: "post",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};
