import React, { useState, useRef } from 'react';
import { AddressModal } from './AddressModal';
import { ExcelUploadModal } from './ExcelUploadModal';
import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
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

const DEPARTMENT_TEAMS = {
  한국무브네스: ['안전', '영업', '품질'],
  서한이노빌리티: ['품질', '공정기술', 'ESG'],
  캄텍: ['품질', 'SOE', '영업', '생산관리'],
  서한ENP: ['인사'],
  기획본부: ['인사', 'IT기획'],
};

const DEPARTMENT_OPTIONS = Object.keys(DEPARTMENT_TEAMS).map(dept => ({
  value: dept,
  label: dept,
}));

function EmployeeRegistration() {
  //파일 정보 상태 관리
  const [isExcelModalOpen, setExcelModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // 사원 정보 상태 관리
  const [employeeData, setEmployeeData] = useState(INITIAL_EMPLOYEE_DATA);

  // 주소 검색 모달 상태 관리
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);

  // 입력값 변경 처리
  const handleChange = e => {
    const { name, value } = e.target;
    setEmployeeData(prev => {
      // 부서가 변경되면 팀 선택을 초기화
      if (name === 'departmentName') {
        return {
          ...prev,
          [name]: value,
          teamName: '',
        };
      }
      //다른 모든 필드의 변경사항도 처리
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // 날짜 선택 처리 함수
  const handleDateChange = date => {
    // 날짜를 YYYY-MM-DD 형식으로 직접 변환
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    setEmployeeData(prev => ({
      ...prev,
      hireDate: formattedDate,
    }));
    setCalendarOpen(false);
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

  // 선택된 부서에 따른 팀 옵션 가져오기
  const getTeamOptions = () => {
    return DEPARTMENT_TEAMS[employeeData.departmentName] || [];
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
              <select
                name="teamName"
                className="form-select"
                value={employeeData.teamName}
                onChange={handleChange}
                disabled={!employeeData.departmentName}
              >
                <option value="">팀을 선택하세요</option>
                {getTeamOptions().map(team => (
                  <option key={team} value={team}>
                    {team}
                  </option>
                ))}
              </select>
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
              <div className="hire-date-group">
                <div className="date-picker-container">
                  <TextField
                    name="hireDate"
                    size="medium"
                    placeholder="입사일자를 선택하세요"
                    value={employeeData.hireDate}
                    onClick={() => setCalendarOpen(!calendarOpen)}
                    readOnly
                  />
                  {calendarOpen && (
                    <div className="calendar-popup">
                      <Calendar
                        onChange={handleDateChange}
                        value={
                          employeeData.hireDate
                            ? new Date(employeeData.hireDate)
                            : new Date()
                        }
                        maxDate={new Date()}
                        calendarType="gregory"
                        formatDay={(locale, date) =>
                          date.toLocaleString('en', { day: 'numeric' })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
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
                size="medium"
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
