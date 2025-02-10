import React, { useState, useRef } from "react";
import { AddressModal } from '../components/AddressModal';
import { ExcelUploadModal } from '../components/ExcelUploadModal';
import { InputField } from '../components/common/InputField';
import "../styles/EmployeeRegistration.css";


//입력 전 초기 사원 정보는 공백으로 설정정
const INITIAL_EMPLOYEE_DATA = {
  empNum:"",
  name: "", 
  address:"",
  detailAddress:"",
  phoneNum:"",
  email:"",
  hireDate:"",
  salary:"",
  rank:"",
  departmentName:"",
  teamName:"",
};

//허용 가능한 엑셀 파일 타입입
const ALLOWED_EXCEL_TYPES = [
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
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
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 주소 검색 완료 처리
  const handleAddressComplete = (data) => {
    setEmployeeData((prev) => ({
      ...prev,
      zipCode: data.zonecode,
      address: data.address,
    }));
    setAddressModalOpen(false);
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("사원 정보:", employeeData);
  };

  //파일 선택 처리
  // 파일 선택 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (ALLOWED_EXCEL_TYPES.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert("엑셀 파일만 업로드 가능합니다.");
      setSelectedFile(null);
    }
  };

  return (
    <div className="employee-registration">
      <h2>사원 정보 등록</h2>

      <form onSubmit={handleSubmit} className="form-grid">
        <InputField
          label="이름"
          name="name"
          value={employeeData.name}
          onChange={handleChange}
        />
        <InputField
          label="입사일자"
          name="hireDate"
          type="date"
          value={employeeData.hireDate}
          onChange={handleChange}
        />
        <InputField
          label="사번"
          name="empNum"
          value={employeeData.empNum}
          onChange={handleChange}
        />
        <InputField
          label="연락처"
          name="phoneNum"
          value={employeeData.phoneNum}
          onChange={handleChange}
        />
        <InputField
          label="부서명"
          name="departmentName"
          value={employeeData.departmentName}
          onChange={handleChange}
        />
        <InputField
          label="팀명"
          name="teamName"
          value={employeeData.teamName}
          onChange={handleChange}
        />
        <div className="address-group">
          <label>주소</label>
          <div className="address-row">
            <input
              type="text"
              name="address"
              placeholder="기본 주소"
              value={employeeData.address}
              readOnly
              onClick={() => setAddressModalOpen(true)}
            />
            <button
              type="button"
              className="address-search-btn"
              onClick={() => setAddressModalOpen(true)}
            >
              주소 검색
            </button>
            <input
              type="text"
              name="detailAddress"
              placeholder="상세 주소 입력"
              value={employeeData.detailAddress}
              onChange={handleChange}
            />
          </div>
        </div>
        <InputField
          label="직급"
          name="rank"
          value={employeeData.rank}
          onChange={handleChange}
        />
        <InputField
          label="급여"
          name="salary"
          type="number"
          value={employeeData.salary}
          onChange={handleChange}
        />
        <InputField
          label="이메일"
          name="email"
          type="email"
          value={employeeData.email}
          onChange={handleChange}
        />
        <div className="button-group">
          <button
            type="button"
            className="excel-btn"
            onClick={() => fileInputRef.current.click()}
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
