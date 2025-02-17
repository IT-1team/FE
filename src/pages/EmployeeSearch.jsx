import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { SearchBar } from '../components/common/SearchBar';
import { EmployeeTable } from '../components/features/EmployeeTable';
import '../styles/EmployeeSearch.scss';
import '../styles/pagination.scss';

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

const EmployeeSearch = () => {
  // 상태 변수 정의
  const [selectedCompany, setSelectedCompany] = useState('전체');
  const [selectedDepartment, setSelectedDepartment] = useState('전체');
  const [searchType, setSearchType] = useState('name'); // 검색 유형
  const [searchValue, setSearchValue] = useState(''); //검색어
  const [filteredData, setFilteredData] = useState([]); //필터링된 데이터
  const [currentPage, setCurrentPage] = useState(0); //현재 페이지
  const [itemsPerPage] = useState(10);
  const [apiData, setApiData] = useState([]); //api로 받아오는 데이터 상태
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  // 전체 조회 핸들러
  const handleFetchAll = () => {
    setFilteredData(apiData);
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

  //API 데이터 받아오기
  const fetchEmployees = async () => {
    try {
      let authToken = token || localStorage.getItem('authToken');

      if (!authToken) {
        console.log('토큰이 없습니다. 로그인 시도 중...');
        authToken = await fetchToken();
      }

      if (!authToken) {
        console.error('유효한 인증 토큰을 가져오지 못했습니다.');
        return;
      }
      let allEmployees = [];
      let currentPage = 1;
      let totalPages = 1;

      const response = await axios.get('https://hrmaster.store/api/employees', {
        params: {
          page: currentPage + 1,
          size: itemsPerPage,
          sort: 'createdAt,desc',
        },
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      });

        const { data } = response.data;
        const formattedEmployees = data.responseDTOList.map(employee => ({
          empNum: employee.empNUM.toString(),
          name: employee.name,
          department: employee.departmentName,
          teamname: employee.teamName,
          rank: employee.emRank,
          phoneNum: employee.phoneNum,
        }));
        allEmployees = [...allEmployees, ...formattedEmployees];
        totalPages = data.totalPages;
        currentPage++;
      } while (currentPage <= totalPages);

      setApiData(allEmployees);
      setFilteredData(allEmployees);
    } catch (error) {
      console.error('직원 정보 가져오기 오류:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      let authToken = localStorage.getItem('authToken');

      if (!authToken) {
        console.log('토큰이 없습니다. 로그인 시도 중...');
        authToken = await fetchToken();
      }

      if (authToken) {
        console.log('사용할 인증 토큰:', authToken);
        setToken(authToken); // 상태 변수 업데이트
        await fetchEmployees(); // 직원 정보 가져오기
      } else {
        console.error('로그인 실패: 토큰을 받아오지 못했습니다.');
      }
    };

    initializeAuth();
  }, []);

  // 검색 핸들러
  const handleSearch = () => {
    const result = apiData.filter(item => {
      const companyMatch =
        selectedCompany === '전체' || item.department === selectedCompany;
      const departmentMatch =
        selectedDepartment === '전체' || item.teamname === selectedDepartment;
      const searchMatch =
        !searchValue ||
        item[searchType].toLowerCase().includes(searchValue.toLowerCase());
      return companyMatch && departmentMatch && searchMatch;
    });
    setFilteredData(result);
    setCurrentPage(1);
  };
  // 계열사 변경 핸들러
  const handleCompanyChange = value => {
    setSelectedCompany(value);
    setSelectedDepartment('전체');
  };

  // 부서 변경 핸들러
  const handleDepartmentChange = value => {
    setSelectedDepartment(value);
  };

  // 현재 페이지의 데이터 계산
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);


  //컴포넌트 마운트 시 전체 데이터 로드
  useEffect(() => {
    handleSearch();
  }, [selectedCompany, selectedDepartment, searchType, searchValue]);

  return (
    <div>
      <h2>사원 조회</h2>
      <SearchBar
        companies={COMPANIES}
        departments={DEPARTMENT_TEAMS[selectedCompany] || ['전체']}
        selectedCompany={selectedCompany}
        selectedDepartment={selectedDepartment}
        searchType={searchType}
        searchValue={searchValue}
        searchOptions={searchOptions}
        onCompanyChange={handleCompanyChange}
        onDepartmentChange={handleDepartmentChange}
        onSearchTypeChange={setSearchType}
        onSearchValueChange={setSearchValue}
        onFetchAll={handleFetchAll}
        onSearch={handleSearch}
      />
      <EmployeeTable data={currentItems} />
      <ReactPaginate
        previousLabel={'이전'}
        nextLabel={'다음'}
        breakLabel={'...'}
        pageCount={Math.ceil(filteredData.length / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={({ selected }) => paginate(selected + 1)}
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

export default EmployeeSearch;
