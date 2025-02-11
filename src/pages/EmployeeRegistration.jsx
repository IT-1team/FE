import React, { useState, useRef } from 'react';
import { AddressModal } from './AddressModal';
import { ExcelUploadModal } from './ExcelUploadModal';
import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
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

const DEPARTMENT_OPTIONS = [
  { value: '한국무브네스', label: '한국무브네스' },
  { value: '서한이노빌리티', label: '서한이노빌리티' },
  { value: '캄텍', label: '캄텍' },
  { value: '서한ENP', label: '서한ENP' },
  { value: '기획본부', label: '기획본부' },
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

  const handleSubmit = e => {
    e.preventDefault();
  };

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
        <div className="info-group">
          <h3>기본 정보</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>이름</label>
              <TextField
                name="name"
                size="medium"
                placeholder="이름을 입력하세요"
                value={employeeData.name}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>사번</label>
              <TextField
                name="empNum"
                size="medium"
                placeholder="사번을 입력하세요"
                value={employeeData.empNum}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>연락처</label>
              <TextField
                name="phoneNum"
                size="medium"
                placeholder="000-0000-0000"
                value={employeeData.phoneNum}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* 소속 정보 */}
        <div className="info-group">
          <h3>소속 정보</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>부서명</label>
              <select
                name="departmentName"
                className="form-select"
                value={employeeData.departmentName}
                onChange={handleChange}
              >
                <option value="">부서를 선택하세요</option>
                {DEPARTMENT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>팀명</label>
              <TextField
                name="teamName"
                size="medium"
                placeholder="팀명을 입력하세요"
                value={employeeData.teamName}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* 주소 정보 */}
        <div className="info-group">
          <h3>주소 정보</h3>
          <div className="address-row">
            <label>주소</label>
            <div className="address-main">
              <TextField
                name="address"
                size="small"
                placeholder="기본주소"
                value={employeeData.address}
                readOnly
              />
              <Button
                buttonSize="smallButton"
                buttonColor="dark"
                type="button"
                action={() => setAddressModalOpen(true)}
              >
                주소검색
              </Button>
            </div>
            <div className="address-sub">
              <TextField
                name="detailAddress"
                size="small"
                placeholder="상세주소"
                value={employeeData.detailAddress}
                onChange={handleChange}
              />
              <TextField
                name="zipCode"
                size="small"
                placeholder="우편번호"
                value={employeeData.zipCode}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* 근무 정보 */}
        <div className="info-group">
          <h3>근무 정보</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>직급</label>
              <TextField
                name="rank"
                size="medium"
                placeholder="직급을 입력하세요"
                value={employeeData.rank}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>입사일자</label>
              <TextField
                name="hireDate"
                size="medium"
                placeholder="입사일자를 선택하세요"
                value={employeeData.hireDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>임금</label>
              <TextField
                name="salary"
                size="medium"
                placeholder="임금을 입력하세요"
                value={employeeData.salary}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>이메일</label>
              <TextField
                name="email"
                type="email"
                size="small"
                placeholder="이메일을 입력하세요"
                value={employeeData.email}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="button-group">
          <Button
            buttonSize="smallButton"
            buttonColor="light"
            type="button"
            action={() => setExcelModalOpen(true)}
          >
            Excel 등록
          </Button>
          <Button buttonSize="smallButton" buttonColor="dark" type="submit">
            사원 등록
          </Button>
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
