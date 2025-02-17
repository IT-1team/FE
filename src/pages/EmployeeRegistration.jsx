import React, { useState, useRef, useEffect } from 'react';
import { AddressModal } from './AddressModal';
import { ExcelUploadModal } from './ExcelUploadModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/EmployeeRegistration.scss';

// 입력 전 초기 사원 정보는 공백으로 설정
const INITIAL_EMPLOYEE_DATA = {
  name: '',
  address: '',
  address2: '',
  departmentName: '',
  teamName: '',
  phoneNum: '',
  email: '',
  hireDate: '',
  salary: '',
  emRank: '',
  status: '재직중',
};

// 허용 가능한 엑셀 파일 타입
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
  // 상태 관리
  const [isExcelModalOpen, setExcelModalOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [employeeData, setEmployeeData] = useState(INITIAL_EMPLOYEE_DATA);
  const [isAddressModalOpen, setAddressModalOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const navigate = useNavigate();

  // 입력값 변경 처리
  const handleChange = e => {
    const { name, value } = e.target;
    setEmployeeData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'departmentName' ? { teamName: '' } : {}),
    }));
  };

  // 날짜 선택 처리 함수
  const handleDateChange = date => {
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

  // 내부적으로 로그인 후 토큰 받아오기
  const fetchToken = async () => {
    try {
      const response = await axios.post(
        'https://hrmaster.store/api/auth/login',
        {
          loginId: 'admin01',
          password: 'password123',
        },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const newToken = response.data?.data?.accessToken; // 서버 응답 구조에 맞게 수정
      if (newToken) {
        localStorage.setItem('authToken', newToken); // 로컬 스토리지에 저장
        setToken(newToken); // 상태 변수 업데이트
        return newToken;
      }
      throw new Error('토큰이 없습니다.');
    } catch (error) {
      console.error('로그인 실패:');
      return null;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      let token = localStorage.getItem('authToken');
      console.log('Current token:', token);

      if (!token) {
        token = await fetchToken();
        if (!token) {
          alert('인증에 실패했습니다.');
          return;
        }
      }

      const requestData = {
        name: employeeData.name,
        address: employeeData.address,
        address2: employeeData.detailAddress,
        departmentName: employeeData.departmentName,
        teamName: employeeData.teamName,
        phoneNum: employeeData.phoneNum,
        email: employeeData.email,
        hireDate: employeeData.hireDate,
        salary: employeeData.salary,
        emRank: employeeData.emRank,
        status: '재직중',
      };

      console.log('Request URL:', 'https://hrmaster.store/api/employees');
      console.log('Request headers:', {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      });
      console.log('Request data:', requestData);

      const response = await axios.post(
        'https://hrmaster.store/api/employees',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8',
            Accept: 'application/json',
            'Accept-Charset': 'utf-8',
          },
        }
      );

      if (response.status === 201) {
        alert('사원이 성공적으로 등록되었습니다.');
        navigate('/dashboard');
      } else {
        console.error('Employee registration failed:', response.data);
        alert('사원 등록에 실패했습니다. 다시 시도해 주세요.');
      }
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });

      if (error.response?.data?.message) {
        alert(`등록 실패: ${error.response.data.message}`);
      } else {
        alert('사원 등록 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  useEffect(() => {
    const checkAndFetchToken = async () => {
      let token = localStorage.getItem('authToken');
      if (!token) {
        token = await fetchToken();
      }
    };

    checkAndFetchToken();
  }, []);

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
        {/* 기본 정보 */}
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
              <label>재직여부</label>
              <TextField
                name="status"
                size="medium"
                placeholder="재직여부를 입력하세요."
                value={employeeData.status}
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
                onClick={() => {
                  console.log('주소 검색 버튼 클릭');
                  setAddressModalOpen(true);
                }}
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
                name="emRank"
                size="medium"
                placeholder="직급을 입력하세요"
                value={employeeData.emRank}
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
            onClick={() => setExcelModalOpen(true)}
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
