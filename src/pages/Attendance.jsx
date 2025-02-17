import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import { SearchBar } from '../components/common/SearchBar';
import AttendanceTable from '../components/features/AttendanceTable';
import StatusButton from '../components/common/StatusButton';
import Button from '../components/common/Button';
import 'react-calendar/dist/Calendar.css';
import '../styles/Attendance.scss';
import '../styles/pagination.scss';

//날짜 한글로 바꾸기 작업용
moment.locale('ko');

const weekDaysKorean = {
  Sunday: '일요일',
  Monday: '월요일',
  Tuesday: '화요일',
  Wednesday: '수요일',
  Thursday: '목요일',
  Friday: '금요일',
  Saturday: '토요일',
};

const DEPARTMENT_TEAMS = {
  한국무브넥스: ['전체', '안전', '영업', '품질'],
  서한이노빌리티: ['전체', '품질', '공정기술', 'ESG'],
  캄텍: ['전체', '품질', 'SOE', '영업', '생산관리'],
  서한ENP: ['전체', '인사'],
  기획본부: ['전체', '인사', 'IT기획'],
};
// 계열사 목록에 '전체' 옵션 추가
const COMPANIES = ['전체', ...Object.keys(DEPARTMENT_TEAMS)];

//검색 옵션
const searchOptions = [
  { value: 'name', label: '이름' },
  { value: 'empNum', label: '사번' },
];

const Attendance = () => {
  // 상태 변수 정의
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterState, setFilterState] = useState({
    company: '전체',
    department: '전체',
    searchType: 'name',
    searchValue: '',
    status: '전체',
  });
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [attendanceData, setAttendanceData] = useState({
    responseDTOList: [],
    totalPages: 1,
    currentPage: 1,
  });

  // 내부적으로 로그인 후 토큰 받아오기
  const fetchToken = async () => {
    try {
      const response = await axios.post(
        'http://ec2-43-201-128-228.ap-northeast-2.compute.amazonaws.com/api/auth/login',
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
      } else {
        console.error('응답에 액세스 토큰이 없습니다.');
        return null;
      }
    } catch (error) {
      console.error(
        '로그인 실패:',
        error.response ? error.response.data : error.message
      );
      return null;
    }
  };

  //API 호출 함수
  const fetchAttendanceData = useCallback(
    async (date, page = 1) => {
      try {
        let authToken = token || localStorage.getItem('authToken');
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const response = await axios.get(
          `http://ec2-43-201-128-228.ap-northeast-2.compute.amazonaws.com/api/attendance?date=${formattedDate}&page=${page}&size=10&sort=createdAt,desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttendanceData(response.data.data);
      } catch (error) {
        console.error('출퇴근 데이터 조회 실패:', error);
      }
    },
    [token]
  );
  //날짜 한글 변환 함수
  const getKoreanWeekDay = date => {
    const weekDay = new Date(date).toLocaleString('en-US', { weekday: 'long' });
    return weekDaysKorean[weekDay];
  };
  // 날짜 형식 변환 함수
  const formatDate = date => {
    const formattedDate = moment(date).format('YYYY.MM.DD');
    const koreanWeekDay = getKoreanWeekDay(date);
    return `${formattedDate} ${koreanWeekDay}`;
  };

  const formattedData = attendanceData.responseDTOList.map(item => ({
    date: moment(item.today).format('YYYY-MM-DD'),
    name: item.name,
    department: item.departmentName,
    team: item.teamName,
    rank: item.emRank,
    checkInTime: moment(item.clockIn).format('HH:mm'),
    checkOutTime: moment(item.clockOut).format('HH:mm'),
    status: item.clockStatus,
  }));

  // 데이터 필터링 함수
  const filterAttendanceData = useCallback(() => {
    return formattedData.filter(item => {
      const companyMatch =
        filterState.company === '전체' ||
        item.department === filterState.company;
      const departmentMatch =
        filterState.department === '전체' ||
        item.team === filterState.department;
      const searchMatch =
        !filterState.searchValue ||
        (item[filterState.searchType] &&
          item[filterState.searchType]
            .toLowerCase()
            .includes(filterState.searchValue.toLowerCase()));
      const statusMatch =
        filterState.status === '전체' || item.status === filterState.status;

      return companyMatch && departmentMatch && searchMatch && statusMatch;
    });
  }, [formattedData, filterState]);

  useEffect(() => {
    fetchAttendanceData(selectedDate);
  }, [selectedDate, fetchAttendanceData]);

  // 필터/데이터 변경 시 필터링
  useEffect(() => {
    const filtered = filterAttendanceData();
    setFilteredData(filtered);
    setCurrentPage(0);
  }, [attendanceData, filterState, selectedDate]);

  // 날짜 변경 핸들러
  const handleDateChange = days => {
    const newDate = moment(selectedDate).add(days, 'days').toDate();
    setSelectedDate(newDate);
  };
  // 필터 상태 변경 핸들러
  const handleFilterChange = updates => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  // 페이지 변경 핸들러
  const handlePageChange = async ({ selected }) => {
    const newPage = selected + 1; // ReactPaginate는 0부터 시작하므로 +1
    await fetchAttendanceData(selectedDate, newPage); // 새로운 페이지 데이터 요청
  };
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);

  return (
    <div className="attendance-container attendance-page">
      <h2>출퇴근 조회</h2>
      {/* 날짜 표기 & 캘린더 */}
      <div className="date-selection">
        <div className="date-navigation">
          <button className="prev" onClick={() => handleDateChange(-1)}>
            &lt; 이전
          </button>
          <span className="current-date">{formatDate(selectedDate)}</span>
          <button className="next" onClick={() => handleDateChange(1)}>
            다음 &gt;
          </button>
          <div className="calendar-container">
            <button
              className="calendar-toggle"
              onClick={() => setShowCalendar(!showCalendar)}
            >
              날짜 선택
            </button>

            {showCalendar && (
              <div className="calendar-popup">
                <Calendar
                  onChange={date => {
                    setSelectedDate(date);
                    setShowCalendar(false);
                  }}
                  value={selectedDate}
                  formatDay={(locale, date) => moment(date).format('DD')}
                  formatMonthYear={(locale, date) =>
                    moment(date).format('YYYY년 MM월')
                  }
                />
              </div>
            )}
          </div>
        </div>
        {/* 현재 선택된 데이터의 status 표시 */}
        <div className="status-buttons">
          {['전체', '정상', '이상'].map(status => (
            <StatusButton
              key={status}
              label={status}
              count={
                filteredData.filter(
                  item =>
                    item.date === moment(selectedDate).format('YYYY-MM-DD') &&
                    (status === '전체' || item.status === status)
                ).length
              }
              type={
                status === '전체'
                  ? 'all'
                  : status === '정상'
                  ? 'normal'
                  : 'abnormal'
              }
              isActive={filterState.status === status}
              onClick={() => handleFilterChange({ status })}
            />
          ))}
        </div>
      </div>

      {/* 검색 바 */}
      <SearchBar
        companies={COMPANIES}
        departments={DEPARTMENT_TEAMS[filterState.company] || ['전체']}
        selectedCompany={filterState.company}
        selectedDepartment={filterState.department}
        searchType={filterState.searchType}
        searchValue={filterState.searchValue}
        searchOptions={searchOptions}
        onCompanyChange={value =>
          handleFilterChange({ company: value, department: '전체' })
        }
        onDepartmentChange={value => handleFilterChange({ department: value })}
        onSearchTypeChange={value => handleFilterChange({ searchType: value })}
        onSearchValueChange={value =>
          handleFilterChange({ searchValue: value })
        }
      />

      {/* 테이블 출력 */}
      <AttendanceTable data={filteredData} />

      {/* 페이지네이션 */}
      <ReactPaginate
        previousLabel={'이전'}
        nextLabel={'다음'}
        breakLabel={'...'}
        pageCount={attendanceData.totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={'active'}
        forcePage={attendanceData.currentPage - 1}
      />
    </div>
  );
};

export default Attendance;
