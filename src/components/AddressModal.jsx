import React from "react";
import DaumPostcode from "react-daum-postcode";

export const AddressModal = ({ isOpen, onClose, onComplete }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose(); // 모달 바깥 클릭 시 닫힘
    }
  };

  const handleComplete = (data) => {
    onComplete(data);
    if(data.target === data.currentTarget)
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-common address-modal">
        <div className="modal-header">
          <h3>주소 검색</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content">
          <DaumPostcode onComplete={handleComplete} />
        </div>
      </div>
    </div>
  );
};
