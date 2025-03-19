import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncOrdersData,
  selectOrders,
  selectPageInfo,
} from "@/redux/orderSlice";

import { convertTime } from "@utils/date";

import { Modal } from "bootstrap";

import Pagination from "@/components/Pagination";
import OrderModal from "@/components/OrderModal";

const orderDefault = {
  create_at: null,
  id: "",
  is_paid: false,
  message: "",
  num: 0,
  products: {},
  total: 0,
  user: {
    address: "",
    county: "",
    district: "",
    email: "",
    name: "",
    paidMethod: "",
    tel: "",
  },
};
export default function OrderPage() {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const pageInfo = useSelector(selectPageInfo);
  useEffect(() => {
    dispatch(
      asyncOrdersData({
        page: 1,
      })
    );
  }, [dispatch]);

  const [tempOrder, setTempOrder] = useState(orderDefault);

  const [modalType, setModalType] = useState("");
  const orderModalRef = useRef(null);
  const orderModalEl = useRef(null);

  useEffect(() => {
    if (orderModalRef.current) {
      orderModalEl.current = new Modal(orderModalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }
  }, []);

  const openModal = useCallback(function (product, type) {
    setTempOrder({
      create_at: product.create_at || "",
      id: product?.id || "",
      is_paid: product?.is_paid || false,
      message: product?.message || "",
      num: product?.num || 0,
      products: product?.products || {},
      total: product?.total || 0,
      user: product?.user || {},
    });

    orderModalEl.current.show();
    setModalType(type);
  }, []);

  const closeModal = useCallback(function () {
    orderModalEl.current?.hide();
    setTempOrder(orderDefault);
  }, []);
  return (
    <>
      <div className="mt-3">
        <div className="d-flex align-items-center justify-content-between">
          <h2>訂單管理</h2>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>購買時間</th>
              <th>客戶資訊</th>
              <th>購買品項</th>
              <th className="text-end">應付金額</th>
              <th width="120">是否付款</th>
              <th width="120">編輯</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((item) => (
                <tr key={item.id}>
                  <td>{convertTime(item.create_at)}</td>
                  <td>
                    <ul className="list-unstyled mb-0">
                      <li>
                        <span>訂單編號：</span>
                        <span>{item.id}</span>
                      </li>
                      <li>
                        <span>姓名：</span>
                        <span>{item.user.name}</span>
                      </li>
                      <li>
                        <span>Email：</span>
                        <span>{item.user.email}</span>
                      </li>
                    </ul>
                  </td>
                  <td>
                    <ol className="list-group list-group-numbered mb-0">
                      {Object.keys(item.products).map((product) => {
                        return (
                          <li
                            className="list-group-item ps-0 border border-0 bg-transparent"
                            key={product}
                          >
                            {item.products?.[product]?.product?.title}
                          </li>
                        );
                      })}
                    </ol>
                  </td>
                  <td className="text-end">
                    <span className="fw-bold">
                      ${item.total.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span
                      className={item.is_paid ? "text-success" : "text-danger"}
                    >
                      {item.is_paid ? "已付款" : "未付款"}
                    </span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => openModal(item, "edit")}
                      >
                        檢視
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => openModal(item, "delete")}
                      >
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  尚無訂單資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {orders && orders.length > 0 && (
          <div className="d-flex justify-content-center py-3">
            <Pagination pageInfo={pageInfo} changePage={asyncOrdersData} />
          </div>
        )}
      </div>
      <OrderModal
        ref={orderModalRef}
        tempOrder={tempOrder}
        modalType={modalType}
        closeModal={closeModal}
      />
    </>
  );
}
