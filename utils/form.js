export const handleModalInputChange = (e, setModalData) => {
  const { id, value, checked, type } = e.target;
  setModalData((prev) => {
    return {
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    };
  });
};
