import { createHashRouter } from "react-router-dom";
import Layout from "@/pages/Layout";
import Products from "@/pages/Products";
import Orders from "@/pages/OrderPage";
import Coupon from "@/pages/CouponPage";
import Login from "@/pages/Login";

import NotFound from "@/pages/NotFound";

const routes = createHashRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Layout />,
    children: [
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "coupon",
        element: <Coupon />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
export default routes;
