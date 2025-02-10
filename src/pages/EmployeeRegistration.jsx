import React, { useState, useRef } from 'react';
import { AddressModal } from './AddressModal';
import { ExcelUploadModal } from './ExcelUploadModal';
import '../styles/EmployeeRegistration.scss';

//입력 전 초기 사원 정보는 공백으로 설정정
const INITIAL_EMPLOYEE_DATA = {
  empNum: '',
  name: '',
  address: '',
  detailAddress: '',
  phoneNum: '',
  email: '',
  hireDate: '',
  salary: '',
  rank: '',
  departmentName: '',
  teamName: '',
};

//허용 가능한 엑셀 파일 타입입
const ALLOWED_EXCEL_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
];

function EmployeeRegistration() {
  //파일 정보 상태 관리
  const [isExcelModalOpen, setExcelModalOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 사원 정보 상태 관리
  const [employeeData, setEmployeeData] = useState(INITIAL_EMPLOYEE_DATA);

  // 주소 검색 모달 상태 관리
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  // 입력값 변경 처리
  const handleChange = e => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 주소 검색 완료 처리
  const handleAddressComplete = data => {
    setEmployeeData(prev => ({
      ...prev,
      zipCode: data.zonecode,
      address: data.address,
    }));
    setAddressModalOpen(false);
  };

  // 폼 제출 처리
  const handleSubmit = e => {
    e.preventDefault();
    console.log('사원 정보:', employeeData);
  };

  //파일 선택 처리
  // 파일 선택 처리
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;

    if (ALLOWED_EXCEL_TYPES.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('엑셀 파일만 업로드 가능합니다.');
      setSelectedFile(null);
    }
  };

  return (
    <div className="employee-registration">
      <h2>사원 정보 등록</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* 사원 기본 정보 입력 필드 */}
          <div className="form-group">
            <label>이름</label>
            <input type="text" name="name" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>입사일자</label>
            <input type="text" name="hireDate" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>사번</label>
            <input type="text" name="empNum" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>연락처</label>
            <input type="text" name="phoneNum" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>부서명</label>
            <input type="text" name="departmentName" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>팀명</label>
            <input type="text" name="teamName" onChange={handleChange} />
          </div>
          <div className="form-row address-row">
            <label>주소</label>
            <div className="address-main">
              <input
                type="text"
                name="address"
                value={employeeData.address}
                readOnly
                placeholder="기본주소"
              />
              <button
                type="button"
                onClick={() => setAddressModalOpen(true)}
                className="address-search-btn"
              >
                주소 검색
              </button>
            </div>
            <div className="address-sub">
              <input
                type="text"
                name="detailAddress"
                value={employeeData.detailAddress}
                onChange={handleChange}
                placeholder="상세주소"
              />
              <input
                type="text"
                name="zipCode"
                value={employeeData.zipCode}
                readOnly
                placeholder="우편번호"
              />
            </div>
          </div>

          <div className="form-group">
            <label>직급</label>
            <input type="text" name="rank" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>임금</label>
            <input type="text" name="salary" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input type="email" name="email" onChange={handleChange} />
          </div>
        </div>
        {/* 버튼 그룹 */}
        <div className="button-group">
          <button
            type="button"
            className="excel-btn"
            onClick={() => setExcelModalOpen(true)}
          >
            사원 대량 등록(EXCEL)
          </button>
          <button type="submit" className="submit-btn">
            사원 등록
          </button>
        </div>
      </form>
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setAddressModalOpen(false)}
        onComplete={handleAddressComplete}
      />
      <ExcelUploadModal
        isOpen={isExcelModalOpen}
        onClose={() => setExcelModalOpen(false)}
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        fileInputRef={fileInputRef}
      />
    </div>
  );
}

export default EmployeeRegistration;
