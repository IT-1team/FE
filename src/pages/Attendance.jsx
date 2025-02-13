import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import ReactPaginate from 'react-paginate';
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

// 더미 데이터 (실제 구현 시 API로 대체)
const dummyData = [
  {
    date: '2025-02-10',
    name: '김지원',
    department: '기획본부',
    team: 'IT기획',
    rank: '대리',
    checkInTime: '09:00',
    checkOutTime: '18:00',
    status: '정상',
  },
  {
    date: '2025-02-10',
    name: '이서연',
    department: '한국무브넥스',
    team: '안전',
    rank: '과장',
    checkInTime: '08:50',
    checkOutTime: '18:30',
    status: '정상',
  },
  {
    date: '2025-02-11',
    name: '박민수',
    department: '서한이노빌리티',
    team: '품질',
    rank: '사원',
    checkInTime: '09:15',
    checkOutTime: '18:20',
    status: '정상',
  },
  {
    date: '2025-02-11',
    name: '최영훈',
    department: '캄텍',
    team: 'SOE',
    rank: '차장',
    checkInTime: '08:45',
    checkOutTime: '17:50',
    status: '정상',
  },
  {
    date: '2025-02-11',
    name: '정다은',
    department: '서한ENP',
    team: '인사',
    rank: '주임',
    checkInTime: '-',
    checkOutTime: '-',
    status: '비정상',
  },
  {
    date: '2025-02-12',
    name: '한지민',
    department: '한국무브넥스',
    team: '영업',
    rank: '대리',
    checkInTime: '09:05',
    checkOutTime: '18:10',
    status: '정상',
  },
  {
    date: '2025-02-12',
    name: '송태호',
    department: '서한이노빌리티',
    team: '공정기술',
    rank: '과장',
    checkInTime: '08:55',
    checkOutTime: '18:30',
    status: '정상',
  },
  {
    date: '2025-02-12',
    name: '임수진',
    department: '캄텍',
    team: '영업',
    rank: '사원',
    checkInTime: '09:30',
    checkOutTime: '-',
    status: '비정상',
  },
  {
    date: '2025-02-12',
    name: '강민재',
    department: '기획본부',
    team: '인사',
    rank: '차장',
    checkInTime: '08:40',
    checkOutTime: '17:45',
    status: '정상',
  },
  {
    date: '2025-02-13',
    name: '윤서아',
    department: '한국무브넥스',
    team: '품질',
    rank: '주임',
    checkInTime: '09:10',
    checkOutTime: '18:15',
    status: '정상',
  },
  {
    date: '2025-02-13',
    name: '조현우',
    department: '서한이노빌리티',
    team: 'ESG',
    rank: '대리',
    checkInTime: '-',
    checkOutTime: '-',
    status: '비정상',
  },
  {
    date: '2025-02-13',
    name: '백지혜',
    department: '캄텍',
    team: '생산관리',
    rank: '과장',
    checkInTime: '08:50',
    checkOutTime: '18:05',
    status: '정상',
  },
  {
    date: '2025-02-13',
    name: '신동훈',
    department: '서한ENP',
    team: '인사',
    rank: '사원',
    checkInTime: '09:20',
    checkOutTime: '-',
    status: '비정상',
  },
  {
    date: '2025-02-13',
    name: '장미란',
    department: '기획본부',
    team: 'IT기획',
    rank: '차장',
    checkInTime: '08:45',
    checkOutTime: '17:55',
    status: '정상',
  },
  {
    date: '2025-02-13',
    name: '권태영',
    department: '한국무브넥스',
    team: '안전',
    rank: '대리',
    checkInTime: '09:00',
    checkOutTime: '18:00',
    status: '정상',
  },
];

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

  // 데이터 필터링 함수
  const filterAttendanceData = useCallback(() => {
    const selectedDateString = moment(selectedDate).format('YYYY-MM-DD');

    return dummyData.filter(item => {
      const dateMatch = item.date === selectedDateString;
      const companyMatch =
        filterState.company === '전체' ||
        item.department === filterState.company;
      const departmentMatch =
        filterState.department === '전체' ||
        item.team === filterState.department;
      const searchMatch =
        !filterState.searchValue ||
        item[filterState.searchType]
          .toLowerCase()
          .includes(filterState.searchValue.toLowerCase());
      const statusMatch =
        filterState.status === '전체' || item.status === filterState.status;

      return (
        dateMatch &&
        companyMatch &&
        departmentMatch &&
        searchMatch &&
        statusMatch
      );
    });
  }, [selectedDate, filterState]);

  // 검색 실행 (selectedDate 또는 filterState 변경 시)
  useEffect(() => {
    setFilteredData(filterAttendanceData());
    setCurrentPage(0);
  }, [filterAttendanceData]);

  // 날짜 변경 핸들러
  const handleDateChange = days => {
    setSelectedDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setDate(newDate.getDate() + days);
      return newDate;
    });
  };

  // 필터 상태 변경 핸들러
  const handleFilterChange = updates => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  // 페이지 변경 핸들러
  const handlePageChange = ({ selected }) => setCurrentPage(selected);

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
                    handleSearch();
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
          {['전체', '정상', '비정상'].map(status => (
            <StatusButton
              key={status}
              label={status}
              count={
                dummyData.filter(
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
      <AttendanceTable data={currentPageData} />

      {/* 페이지네이션 */}
      <ReactPaginate
        previousLabel={'이전'}
        nextLabel={'다음'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
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
      />
    </div>
  );
};

export default Attendance;
