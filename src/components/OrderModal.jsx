import { forwardRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";

import {
  selectModalModifySuccess,
  setModalModifySuccess,
} from "@/redux/commonSlice";
import { asyncUpdateOrder, asyncDeleteOrderData } from "@/redux/orderSlice";

import { convertTime } from "@utils/date";
import { handleModalInputChange } from "@utils/form";

function OrderModalComponent({ tempOrder, closeModal, modalType }, ref) {
  const [modalData, setModalData] = useState(tempOrder); // 避免修改到原本的 tempOrder

  const modalModifySuccess = useSelector(selectModalModifySuccess);

  const dispatch = useDispatch();

  useEffect(() => {
    setModalData(tempOrder);
  }, [tempOrder]);

  useEffect(() => {
    // 當 modalModifySuccess 為 true 時，才可關閉 modal
    if (modalModifySuccess) {
      closeModal();
      dispatch(setModalModifySuccess(false));
    }
  }, [modalModifySuccess, dispatch, closeModal]);

  async function updateOrderData() {
    const callApi = {
      edit: asyncUpdateOrder,
      delete: asyncDeleteOrderData,
    };
    const orderData = {
      data: {
        ...modalData,
        is_paid: modalData.is_paid,
      },
    };
    await dispatch(callApi[modalType](orderData));
  }

  function handleInputChange(e) {
    return handleModalInputChange(e, setModalData);
  }
  return (
    <div className="modal fade" tabIndex="-1" ref={ref}>
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">
              {modalType === "edit" && "訂單內容"}
              {modalType === "delete" && "刪除訂單"}
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
                是否刪除 <span className="text-danger">{modalData?.id}</span> ?
              </span>
            )}

            {modalType === "edit" && (
              <>
                <div className="row">
                  <div className="col-md-6">
                    <h3 className="fs-6 pb-2">使用者資料</h3>
                    <table className="table table-striped table-hover mb-0">
                      {modalData.user && (
                        <tbody>
                          <tr>
                            <th width="80">姓名</th>
                            <td>{modalData.user.name}</td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>{modalData.user.email}</td>
                          </tr>
                          <tr>
                            <th>電話</th>
                            <td>{modalData.user.tel}</td>
                          </tr>
                          <tr>
                            <th>地址</th>
                            <td>{modalData.user.address}</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h3 className="fs-6 pb-2">訂單細節</h3>
                    <table className="table table-striped table-hover mb-0">
                      <tbody>
                        <tr>
                          <th width="80">訂單編號</th>
                          <td>{modalData.id}</td>
                        </tr>
                        <tr>
                          <th>下單時間</th>
                          <td>{convertTime(modalData.create_at)}</td>
                        </tr>
                        {modalData.paid_date && (
                          <tr>
                            <th>付款時間</th>
                            <td>
                              <span>{convertTime(modalData.paid_date)}</span>
                            </td>
                          </tr>
                        )}
                        <tr>
                          <th>付款狀態</th>
                          <td>
                            <span
                              className={
                                modalData.is_paid
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {modalData.is_paid ? "已付款" : "未付款"}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <th>總金額</th>
                          <td>
                            <span className="fw-bold">
                              ${modalData.total.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="d-flex justify-content-end py-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="is_paid"
                          onChange={handleInputChange}
                          checked={modalData.is_paid}
                        />
                        <label className="form-check-label" htmlFor="is_paid">
                          {modalData.is_paid ? "已付款" : "未付款"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <h3 className="fs-6 pb-2">選購商品</h3>
                    <table className="table table-striped table-hover">
                      <thead>
                        <tr>
                          <th></th>
                          <th>商品名稱</th>
                          <th>數量</th>
                          <th className="text-end">金額</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(modalData.products).map((product) => {
                          const productItem = modalData.products?.[product];
                          return (
                            <tr key={product}>
                              <td width="80">
                                <img
                                  style={{ width: "50px" }}
                                  className="object-cover"
                                  src={productItem.product.imageUrl}
                                  alt=""
                                />
                              </td>
                              <th className="align-middle">
                                {productItem?.product?.title}
                              </th>
                              <td className="align-middle">
                                {productItem?.qty} / {productItem?.product.unit}
                              </td>
                              <td className="text-end align-middle">
                                <span className="fw-bold">
                                  $
                                  {modalData.products?.[
                                    product
                                  ]?.final_total.toLocaleString()}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
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
              onClick={updateOrderData}
            >
              {modalType === "edit" && "修改訂單"}
              {modalType === "delete" && "確定"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const OrderModal = forwardRef(OrderModalComponent);
OrderModalComponent.propTypes = {
  tempOrder: PropTypes.shape({
    create_at: PropTypes.string,
    id: PropTypes.string,
    is_paid: PropTypes.bool,
    message: PropTypes.string,
    num: PropTypes.number,
    products: PropTypes.object,
    total: PropTypes.number,
    user: PropTypes.shape({
      address: PropTypes.string,
      county: PropTypes.string,
      district: PropTypes.string,
      email: PropTypes.string,
      name: PropTypes.string,
      paidMethod: PropTypes.string,
      tel: PropTypes.string,
    }),
  }),
  closeModal: PropTypes.func,
  modalType: PropTypes.oneOf(["edit", "delete"]),
};

export default OrderModal;
