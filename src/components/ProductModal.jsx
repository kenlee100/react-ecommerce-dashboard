import { forwardRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage } from "@apis/product";

import {
  asyncUpdateProduct,
  asyncDeleteProductData,
  asyncAddProduct,
} from "@/redux/productSlice";
import {
  selectModalModifySuccess,
  setModalModifySuccess,
} from "@/redux/commonSlice";

import { handleModalInputChange } from "@utils/form";

function ProductModalComponent(
  { tempProduct, closeProductModal, modalType, placeholderImage },
  ref
) {
  const [modalData, setModalData] = useState(tempProduct); // 避免修改到原本的 tempProduct

  const modalModifySuccess = useSelector(selectModalModifySuccess);

  const dispatch = useDispatch();
  useEffect(() => {
    setModalData(tempProduct);
  }, [tempProduct]);

  useEffect(() => {
    // 當 modalModifySuccess 為 true 時，才可關閉 modal
    if (modalModifySuccess) {
      closeProductModal();
      dispatch(setModalModifySuccess(false));
    }
  }, [modalModifySuccess, dispatch, closeProductModal]);

  async function updateProductsData() {
    const callApi = {
      edit: asyncUpdateProduct,
      new: asyncAddProduct,
      delete: asyncDeleteProductData,
    };

    const productData = {
      data: {
        ...modalData,
        origin_price: parseInt(modalData.origin_price),
        price: parseInt(modalData.price),
        imagesUrl: [...modalData.imagesUrl],
        is_enabled: modalData.is_enabled ? 1 : 0,
      },
    };
    if (modalType === "delete") {
      productData.data.imageUrl = placeholderImage;
    }
    await dispatch(callApi[modalType](productData));
  }

  function handleAddImage() {
    setModalData((prev) => {
      return {
        ...prev,
        imagesUrl: [...prev.imagesUrl, placeholderImage],
      };
    });
  }
  function handleRemoveImage(index) {
    setModalData((prev) => {
      const updatedImagesUrl = prev.imagesUrl.filter((item, i) => i !== index);
      return {
        ...prev,
        imagesUrl: updatedImagesUrl,
      };
    });
  }
  function handleImageChange(e, index) {
    const { value } = e.target;
    setModalData((prev) => {
      const imagesArr = [...prev.imagesUrl];
      imagesArr[index] = value;
      return {
        ...prev,
        imagesUrl: imagesArr,
      };
    });
  }
  function handleInputChange(e) {
    return handleModalInputChange(e, setModalData);
  }

  async function handleFileChange(e, type, index) {
    const { files } = e.target;
    const file = files[0];
    const formData = new FormData();

    if (type === "main") {
      formData.append("main", file);
    } else {
      formData.append(`multi-${index}`, file);
    }

    try {
      const res = await uploadImage(formData);
      const { imageUrl } = res;

      if (type === "main") {
        setModalData((pre) => ({
          ...pre,
          imageUrl,
        }));
      } else {
        const imagesUrl = [...modalData.imagesUrl];
        imagesUrl[index] = imageUrl;
        setModalData((pre) => ({
          ...pre,
          imagesUrl,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
      ref={ref}
    >
      <div className="modal-dialog modal-dialog-scrollable modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">
              {modalType === "edit" && "修改產品"}
              {modalType === "new" && "新增產品"}
              {modalType === "delete" && "刪除產品"}
            </h1>
            <button
              type="button"
              className="btn-close"
              onClick={closeProductModal}
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
                <div className="row">
                  <div className="col-sm-4">
                    <div className="d-flex flex-grow-1 flex-column overflow-y-auto">
                      <div className="mb-3">
                        <label htmlFor="imageUrl" className="form-label">
                          主要圖片
                        </label>
                        <div className="form-group">
                          <input
                            type="text"
                            className="form-control rounded-bottom-0 border-bottom-0"
                            name="imageUrl"
                            id="imageUrl"
                            value={modalData.imageUrl}
                            onChange={handleInputChange}
                          />

                          <input
                            className="form-control rounded-bottom-0 rounded-top-0"
                            type="file"
                            name="main"
                            accept=".jpg,.jpeg,.png"
                            onChange={(e) => handleFileChange(e, "main")}
                            placeholder="上傳主要圖片"
                          />

                          <img
                            src={modalData.imageUrl}
                            alt=""
                            className="img-fluid"
                          />
                        </div>
                      </div>
                      {modalData.imagesUrl?.map((item, index) => {
                        return (
                          <div
                            className="mb-3 pt-3 border-top"
                            key={`image-${index + 1}`}
                          >
                            <label className="form-label">
                              圖片 {index + 1}
                            </label>
                            <div className="form-group">
                              <input
                                className="form-control rounded-bottom-0 border-bottom-0"
                                type="text"
                                name={`image-${index + 1}`}
                                value={item}
                                onChange={(e) => handleImageChange(e, index)}
                                id=""
                                placeholder={`請輸入圖片${index + 1}連結`}
                              />
                              <input
                                className="form-control rounded-bottom-0 rounded-top-0"
                                type="file"
                                accept=".jpg,.jpeg,.png"
                                name={`multi-${index + 1}`}
                                onChange={(e) =>
                                  handleFileChange(e, "multi", index)
                                }
                              />
                              <img className="img-fluid" src={item} alt="" />
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm d-block w-100 rounded-top-0"
                                onClick={() => handleRemoveImage(index)}
                              >
                                刪除
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {modalData.imagesUrl.length < 4 &&
                        modalData.imagesUrl[modalData.imagesUrl.length - 1] !==
                          "" && (
                          <div className="mb-3">
                            <button
                              type="button"
                              className="btn btn-outline-primary btn-sm d-block w-100"
                              onClick={handleAddImage}
                            >
                              新增其他圖片欄位
                            </button>
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="col-sm-8">
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
                        placeholder="請輸入產品標題"
                      />
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="category" className="form-label">
                          分類
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="category"
                          id="category"
                          value={modalData.category}
                          onChange={handleInputChange}
                          placeholder="請輸入分類"
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="unit" className="form-label">
                          單位
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="unit"
                          id="unit"
                          value={modalData.unit}
                          onChange={handleInputChange}
                          placeholder="請輸入單位"
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        描述
                      </label>
                      <textarea
                        rows="3"
                        className="form-control"
                        name="description"
                        id="description"
                        value={modalData.description}
                        onChange={handleInputChange}
                        placeholder="請輸入描述"
                      ></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="content" className="form-label">
                        商品內容
                      </label>
                      <textarea
                        rows="3"
                        className="form-control"
                        name="content"
                        id="content"
                        value={modalData.content}
                        onChange={handleInputChange}
                        placeholder="請輸入商品內容"
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="mb-3 col-md-6">
                        <label htmlFor="origin_price" className="form-label">
                          原價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="origin_price"
                          id="origin_price"
                          value={modalData.origin_price}
                          onChange={handleInputChange}
                          placeholder="請輸入數字"
                          min="0"
                        />
                      </div>
                      <div className="mb-3 col-md-6">
                        <label htmlFor="price" className="form-label">
                          售價
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          id="price"
                          value={modalData.price}
                          onChange={handleInputChange}
                          placeholder="請輸入數字"
                          min="0"
                        />
                      </div>
                    </div>
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
                </div>
              </form>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeProductModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={updateProductsData}
            >
              {modalType === "edit" && "修改產品"}
              {modalType === "new" && "新增產品"}
              {modalType === "delete" && "確定"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ProductModal = forwardRef(ProductModalComponent);
ProductModalComponent.propTypes = {
  tempProduct: PropTypes.shape({
    title: PropTypes.string,
    imageUrl: PropTypes.string,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
    category: PropTypes.string,
    unit: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
    origin_price: PropTypes.number,
    price: PropTypes.number,
    is_enabled: PropTypes.bool,
  }),
  placeholderImage: PropTypes.string,
  closeProductModal: PropTypes,
  modalType: PropTypes.oneOf(["edit", "new", "delete"]),
};

export default ProductModal;
