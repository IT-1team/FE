import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import { SearchBar } from '../components/common/SearchBar';
import { EmployeeTable } from '../components/features/EmployeeTable';
import '../styles/EmployeeSearch.scss';
import '../styles/Pagination.scss';

//dummy 데이터
// const dummyData = [
//   {
//     empNum: '12340',
//     name: '김지원',
//     department: '기획본부',
//     teamname: 'IT기획',
//     rank: '대리',
//     phoneNum: '010-1234-5678',
//   },
//   {
//     empNum: '12341',
//     name: '박민수',
//     department: '서한ENP',
//     teamname: '인사',
//     rank: '과장',
//     phoneNum: '010-2345-6789',
//   },
//   {
//     empNum: '12342',
//     name: '이서연',
//     department: '한국무브넥스',
//     teamname: '영업',
//     rank: '사원',
//     phoneNum: '010-3456-7890',
//   },
//   {
//     empNum: '12343',
//     name: '최영훈',
//     department: '한국무브넥스',
//     teamname: '영업',
//     rank: '부장',
//     phoneNum: '010-4567-8901',
//   },
//   {
//     empNum: '12344',
//     name: '정하은',
//     department: '기획본부',
//     teamname: 'IT기획',
//     rank: '사원',
//     phoneNum: '010-5678-9012',
//   },
//   {
//     empNum: '12345',
//     name: '한지민',
//     department: '서한이노빌리티',
//     teamname: 'ESG',
//     rank: '대리',
//     phoneNum: '010-6789-0123',
//   },
//   {
//     empNum: '12346',
//     name: '오세훈',
//     department: '캄텍',
//     teamname: 'SOE',
//     rank: '과장',
//     phoneNum: '010-7890-1234',
//   },
//   {
//     empNum: '12347',
//     name: '김민재',
//     department: '캄텍',
//     teamname: '영업',
//     rank: '사원',
//     phoneNum: '010-8901-2345',
//   },
//   {
//     empNum: '12348',
//     name: '박지성',
//     department: '한국무브넥스',
//     teamname: '품질',
//     rank: '대리',
//     phoneNum: '010-9012-3456',
//   },
//   {
//     empNum: '12349',
//     name: '손흥민',
//     department: '기획본부',
//     teamname: 'IT기획',
//     rank: '부장',
//     phoneNum: '010-0123-4567',
//   },
//   {
//     empNum: '12350',
//     name: '이강인',
//     department: '서한ENP',
//     teamname: '인사',
//     rank: '사원',
//     phoneNum: '010-1234-5678',
//   },
//   {
//     empNum: '12351',
//     name: '황희찬',
//     department: '서한이노빌리티',
//     teamname: '공정기술',
//     rank: '과장',
//     phoneNum: '010-2345-6789',
//   },
//   {
//     empNum: '12352',
//     name: '조규성',
//     department: '캄텍',
//     teamname: '생산관리',
//     rank: '대리',
//     phoneNum: '010-3456-7890',
//   },
//   {
//     empNum: '12353',
//     name: '김연아',
//     department: '한국무브넥스',
//     teamname: '영업',
//     rank: '사원',
//     phoneNum: '010-4567-8901',
//   },
//   {
//     empNum: '12354',
//     name: '유재석',
//     department: '서한이노빌리티',
//     teamname: '품질',
//     rank: '부장',
//     phoneNum: '010-5678-9012',
//   },
// ];

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
  const itemsPerPage = 10;
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

      const response = await axios.get(
        'http://ec2-43-201-128-228.ap-northeast-2.compute.amazonaws.com/api/employees',
        {
          params: {
            page: currentPage + 1,
            size: itemsPerPage,
            sort: 'createdAt,desc',
          },
          headers: { Authorization: `Bearer ${authToken}` },
          withCredentials: true,
        }
      );

      if (response.data?.data?.responseDTOList) {
        const formattedData = response.data.data.responseDTOList.map(
          employee => ({
            empNum: employee.empNUM.toString(),
            name: employee.name,
            department: employee.departmentName,
            teamname: employee.teamName,
            rank: employee.emRank,
            phoneNum: employee.phoneNum,
          })
        );
        setApiData(formattedData);
        setFilteredData(formattedData);
        setTotalPages(response.data.data.totalPages || 1);
      } else {
        console.error('API 응답 구조가 예상과 다릅니다:', response.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error('인증 오류. 다시 로그인이 필요합니다.');
        setToken(null);
        localStorage.removeItem('authToken');
      } else {
        console.error('직원 정보 가져오기 오류:', error);
      }
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
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  //컴포넌트 마운트 시 전체 데이터 로드
  useEffect(() => {
    handleSearch();
  }, [selectedCompany, selectedDepartment, searchType, searchValue, apiData]);

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
      <EmployeeTable data={currentPageData} />
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

export default EmployeeSearch;
