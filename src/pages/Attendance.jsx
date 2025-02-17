import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/ko';
import { SearchBar } from '../components/common/SearchBar';
import AttendanceTable from '../components/features/AttendanceTable';
import StatusButton from '../components/common/StatusButton';
import 'react-calendar/dist/Calendar.css';
import '../styles/Attendance.scss';
import '../styles/Pagination.scss';

// 날짜 한글로 바꾸기 작업용
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

const COMPANIES = ['전체', ...Object.keys(DEPARTMENT_TEAMS)];

const searchOptions = [
  { value: 'name', label: '이름' },
  { value: 'empNum', label: '사번' },
];

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterState, setFilterState] = useState({
    company: '전체',
    department: '전체',
    searchType: 'name',
    searchValue: '',
    status: '전체',
  });
  const [filteredData, setFilteredData] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [attendanceData, setAttendanceData] = useState({
    responseDTOList: [],
    totalPages: 1,
    currentPage: 1,
  });

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

      const newToken = response.data?.data?.accessToken;
      if (newToken) {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        return newToken;
      }
      console.error('응답에 액세스 토큰이 없습니다.');
      return null;
    } catch (error) {
      console.error('로그인 실패:', error.response?.data || error.message);
      return null;
    }
  };

  const fetchAttendanceData = useCallback(
    async (date, page = 1) => {
      try {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const response = await axios.get(
          `https://hrmaster.store/api/attendance?date=${formattedDate}&page=${page}&size=10&sort=createdAt,desc`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAttendanceData(response.data.data);
      } catch (error) {
        console.error('출퇴근 데이터 조회 실패:', error);
      }
    },
    [token]
  );

  const getKoreanWeekDay = date => {
    const weekDay = new Date(date).toLocaleString('en-US', { weekday: 'long' });
    return weekDaysKorean[weekDay];
  };

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
        item[filterState.searchType]
          ?.toLowerCase()
          .includes(filterState.searchValue.toLowerCase());
      const statusMatch =
        filterState.status === '전체' || item.status === filterState.status;

      return companyMatch && departmentMatch && searchMatch && statusMatch;
    });
  }, [formattedData, filterState]);

  useEffect(() => {
    fetchAttendanceData(selectedDate);
  }, [selectedDate, fetchAttendanceData]);

  useEffect(() => {
    const filtered = filterAttendanceData();
    setFilteredData(filtered);
  }, [attendanceData, filterState, filterAttendanceData]);

  const handleDateChange = days => {
    const newDate = moment(selectedDate).add(days, 'days').toDate();
    setSelectedDate(newDate);
  };

  const handleFilterChange = updates => {
    setFilterState(prev => ({ ...prev, ...updates }));
  };

  const handlePageChange = ({ selected }) => {
    const newPage = selected + 1;
    fetchAttendanceData(selectedDate, newPage);
  };

  return (
    <div className="attendance-container attendance-page">
      <h2>출퇴근 조회</h2>

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

      <AttendanceTable data={filteredData} />

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
