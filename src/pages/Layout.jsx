import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { checkUserLogin, userLogout } from "@apis/auth";
import { useAuth } from "@/hooks/useAuth";

import { useSelector, useDispatch } from "react-redux";
import { selectLoading, setIsLoading } from "@/redux/commonSlice";
import { pushMessage } from "@/redux/toastSlice";

import { LayoutProvider } from "@/components/LayoutContext";
import Navbar from "@/components/Navbar";
import Toast from "@/components/Toast";
import Loading from "@/components/Loading";

const linkList = [
  {
    path: "/admin/products",
    title: "產品管理",
  },
  {
    path: "/admin/orders",
    title: "訂單管理",
  },
  {
    path: "/admin/coupon",
    title: "優惠券管理",
  },
];

function Layout() {
  return (
    <LayoutProvider>
      <LayoutContent />
    </LayoutProvider>
  );
}
function LayoutContent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectLoading);
  const { isAuth, verifyAuth } = useAuth(checkUserLogin);

  useEffect(() => {
    verifyAuth();
  }, []);

  async function handleLogout() {
    dispatch(setIsLoading(true));
    try {
      const res = await userLogout();
      const { message } = res;
      await dispatch(pushMessage({ text: message, status: "success" }));
      document.cookie = "hexToken=;expires=;";
      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setIsLoading(false));
    }
  }
  return (
    <>
      <div className="container">
        <Navbar linkList={linkList}>
          <div className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleLogout}
            >
              登出
            </button>
          </div>
        </Navbar>
        <Outlet />
      </div>
      <Loading isLoading={isLoading} />
      <Toast />
    </>
  );
}

export default Layout;
