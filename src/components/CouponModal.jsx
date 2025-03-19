import { forwardRef, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import {
  selectModalModifySuccess,
  setModalModifySuccess,
} from "@/redux/commonSlice";

import {
  asyncUpdateCoupon,
  asyncDeleteCouponData,
  asyncAddCoupon,
} from "@/redux/couponSlice";
import {
  getCurrentUnixTimestamp,
  formatUnixTimestampToDate,
  addOneDayToUnixTimestamp,
  convertDateStringToUnixTimestamp,
} from "@utils/date";

function CouponModalComponent({ tempCoupon, closeModal, modalType }, ref) {
  const [modalData, setModalData] = useState(tempCoupon); // 避免修改到原本的 tempCoupon

  const modalModifySuccess = useSelector(selectModalModifySuccess);

  const dispatch = useDispatch();

  const nextDay = useMemo(() => {
    const currentTimestamp = getCurrentUnixTimestamp();
    const nextDayTimestamp = addOneDayToUnixTimestamp(currentTimestamp);
    const nextDayDateString = formatUnixTimestampToDate(nextDayTimestamp);
    return nextDayDateString;
  }, []);

  const [newDate, setNewDate] = useState(
    modalData.due_date ? formatUnixTimestampToDate(modalData.due_date) : nextDay
  );

  useEffect(() => {
    setModalData(tempCoupon);
    // 當 tempCoupon 更新時，同時更新日期字串
    if (tempCoupon.due_date) {
      setNewDate(formatUnixTimestampToDate(tempCoupon.due_date));
    } else {
      setNewDate(nextDay);
    }
  }, [tempCoupon, nextDay]);

  useEffect(() => {
    // 當 modalModifySuccess 為 true 時，才可關閉 modal
    if (modalModifySuccess) {
      closeModal();
      dispatch(setModalModifySuccess(false));
    }
  }, [modalModifySuccess, dispatch, closeModal]);

  async function updateCouponData() {
    const callApi = {
      edit: asyncUpdateCoupon,
      new: asyncAddCoupon,
      delete: asyncDeleteCouponData,
    };
    const couponData = {
      data: {
        ...modalData,
        title: modalData.title,
        is_enabled: modalData.is_enabled ? 1 : 0,
        percent: parseInt(modalData.percent),
        due_date: modalData.due_date,
        code: modalData.code,
      },
    };
    await dispatch(callApi[modalType](couponData));
  }

  function handleInputChange(e) {
    const { id, value, checked, type } = e.target;
    if (e.target.type === "date") {
      setNewDate(value); // 更新日期字串
      const timestamp = convertDateStringToUnixTimestamp(value); // 轉換為時間戳
      setModalData((prev) => {
        return {
          ...prev,
          due_date: timestamp, // 更新 modalData 的 due_date
        };
      });
    } else {
      setModalData((prev) => {
        return {
          ...prev,
          [id]: type === "checkbox" ? checked : value,
        };
      });
    }
  }

  return (
    <div className="modal fade" tabIndex="-1" ref={ref}>
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">
              {modalType === "new" && "新增優惠卷"}
              {modalType === "edit" && "編輯優惠卷"}
              {modalType === "delete" && "刪除優惠卷"}
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            {modalType === "delete" && (
              <span>
                是否刪除 <span className="text-danger">{modalData?.title}</span>{" "}
                ?
              </span>
            )}

            {(modalType === "edit" || modalType === "new") && (
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    id="title"
                    value={modalData.title}
                    onChange={handleInputChange}
                    placeholder="請輸入優惠券標題"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="code" className="form-label">
                    優惠碼
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="code"
                    id="code"
                    value={modalData.code}
                    onChange={handleInputChange}
                    placeholder="請輸入優惠碼"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="due_date" className="form-label">
                    到期日
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="due_date"
                    id="due_date"
                    value={newDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="percent" className="form-label">
                    折扣百分比
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="percent"
                    id="percent"
                    value={modalData.percent}
                    onChange={handleInputChange}
                    placeholder="請輸入折扣百分比"
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="is_enabled"
                      onChange={handleInputChange}
                      checked={modalData.is_enabled}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      {modalData.is_enabled ? "已啟用" : "未啟用"}
                    </label>
                  </div>
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={updateCouponData}
            >
              {modalType === "new" && "新增優惠券"}
              {modalType === "edit" && "更新優惠券"}
              {modalType === "delete" && "確定"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CouponModal = forwardRef(CouponModalComponent);
CouponModalComponent.propTypes = {
  tempCoupon: PropTypes.shape({
    title: PropTypes.string,
    is_enabled: PropTypes.number,
    percent: PropTypes.number,
    due_date: PropTypes.number,
    id: PropTypes.string,
    code: PropTypes.string,
  }),
  closeModal: PropTypes.func,
  modalType: PropTypes.oneOf(["edit", "new", "delete"]),
};

export default CouponModal;
