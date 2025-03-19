import { useCallback } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setIsLoading } from "@/redux/commonSlice";
export const useAuth = (checkUserLogin) => {
  const [isAuth, setIsAuth] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const verifyAuth = useCallback(
    async function () {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
        "$1"
      );
      if (!token) {
        setIsAuth(false);
        navigate("/login");
        dispatch(setIsLoading(false));
        return;
      }
      try {
        dispatch(setIsLoading(true));
        await checkUserLogin();
        setIsAuth(true);
        navigate("/admin/products");
      } catch (error) {
        console.error("驗證錯誤:", error);
        setIsAuth(false);
        navigate("/login");
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, checkUserLogin, navigate]
  );
  return { isAuth, setIsAuth, verifyAuth };
};
