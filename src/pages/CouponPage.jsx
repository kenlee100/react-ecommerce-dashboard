import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  asyncCouponsData,
  selectCoupons,
  selectPageInfo,
} from "@/redux/couponSlice";

import { Modal } from "bootstrap";

import Pagination from "@/components/Pagination";
import CouponModal from "@/components/CouponModal";

import { convertTime } from "@utils/date";
const couponDefault = {
  due_date: 0,
  is_enabled: 0,
  percent: 0,
  title: "",
  code: "",
  id: "",
  num: "",
};

export default function CouponPage() {
  const dispatch = useDispatch();
  const coupons = useSelector(selectCoupons);
  const pageInfo = useSelector(selectPageInfo);
  useEffect(() => {
    dispatch(
      asyncCouponsData({
        page: 1,
      })
    );
  }, [dispatch]);

  const [tempCoupon, setTempCoupon] = useState(couponDefault);

  const [modalType, setModalType] = useState("");
  const couponModalRef = useRef(null);
  const couponModalEl = useRef(null);

  useEffect(() => {
    if (couponModalRef.current) {
      couponModalEl.current = new Modal(couponModalRef.current, {
        backdrop: "static",
        keyboard: false,
      });
    }
  }, []);

  const openModal = useCallback(function (coupon, type) {
    setTempCoupon({
      id: coupon?.id || "",
      title: coupon.title || "",
      is_enabled: coupon?.is_enabled || 0,
      percent: coupon?.percent || 0,
      due_date: coupon?.due_date || 0,
      num: coupon?.num || 0,
      code: coupon?.code || "",
    });

    couponModalEl.current.show();
    setModalType(type);
  }, []);

  const closeModal = useCallback(function () {
    couponModalEl.current?.hide();
    setTempCoupon(couponDefault);
  }, []);
  return (
    <>
      <div className="mt-3">
        <div className="d-flex align-items-center justify-content-between">
          <h2>優惠券管理</h2>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => openModal(tempCoupon, "new")}
          >
            新增優惠券
          </button>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>名稱</th>
              <th>折扣百分比</th>
              <th>到期日</th>
              <th width="120">是否啟用</th>
              <th width="120">編輯</th>
            </tr>
          </thead>
          <tbody>
            {coupons && coupons.length > 0 ? (
              coupons.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.percent}%</td>
                  <td>{convertTime(item.due_date)}</td>
                  <td>
                    <span
                      className={
                        item.is_enabled ? "text-success" : "text-danger"
                      }
                    >
                      {item.is_enabled ? "啟用" : "未啟用"}
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
                  尚無優惠券資料
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {pageInfo.total_pages > 1 && (
          <div className="d-flex justify-content-center py-3">
            <Pagination pageInfo={pageInfo} changePage={asyncCouponsData} />
          </div>
        )}
      </div>
      <CouponModal
        ref={couponModalRef}
        tempCoupon={tempCoupon}
        modalType={modalType}
        closeModal={closeModal}
      />
    </>
  );
}
