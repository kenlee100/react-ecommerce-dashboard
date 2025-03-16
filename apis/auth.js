const { VITE_URL } = import.meta.env;
import request from "@utils/request";

export const userLogin = (data) =>
  request({
    url: `${VITE_URL}/admin/signin`,
    method: "post",
    data,
  });
export const userLogout = () =>
  request({
    url: `${VITE_URL}/logout`,
    method: "post",
  });
export const checkUserLogin = () =>
  request({
    url: `${VITE_URL}/api/user/check`,
    method: "post",
  });
