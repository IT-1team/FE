import React from "react";

export const ExcelUploadModal = ({
  isOpen,
  onClose,
  selectedFile,
  onFileChange,
  fileInputRef,
}) => {
  if (!isOpen) return null;

   const handleOverlayClick = (e) => {
     if (e.target === e.currentTarget) {
       onClose();
     }
   };
  const handleSubmit = () => {
    onClose();
    alert("처리되었습니다");
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-common excel-modal">
        <div className="modal-header">
          <h3>Excel 등록</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-content">
          <div className="file-input-wrapper">
            <input
              type="file"
              onChange={onFileChange}
              accept=".xlsx, .xls"
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <input
              type="text"
              readOnly
              value={selectedFile ? selectedFile.name : ""}
              placeholder="파일을 선택하세요"
            />
            <button onClick={() => fileInputRef.current.click()}>
              파일 찾기
            </button>
          </div>
          {selectedFile && (
            <div className="selected-file">
              <span>선택된 파일: {selectedFile.name}</span>
            </div>
          )}
          <div className="modal-footer">
            <button className="submit-btn" onClick={handleSubmit}>
              사원 등록
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
