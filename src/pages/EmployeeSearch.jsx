import React, { useState, useEffect, useCallback } from 'react';
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

const COMPANIES = ['전체', ...Object.keys(DEPARTMENT_TEAMS)];

const searchOptions = [
  { value: 'name', label: '이름' },
  { value: 'empNum', label: '사번' },
];

const EmployeeSearch = () => {
  const [selectedCompany, setSelectedCompany] = useState('전체');
  const [selectedDepartment, setSelectedDepartment] = useState('전체');
  const [searchType, setSearchType] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [apiData, setApiData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [token, setToken] = useState(localStorage.getItem('authToken'));

  const fetchToken = async () => {
    try {
      const response = await axios.post(
        'https://hrmaster.store/api/auth/login',
        {
          loginId: 'admin01',
          password: 'password123',
        },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: false,
        }
      );

      const newToken = response.data?.data?.accessToken;
      if (newToken) {
        localStorage.setItem('authToken', newToken);
        setToken(newToken);
        return newToken;
      }
      throw new Error('토큰이 없습니다.');
    } catch (error) {
      console.error('로그인 실패:', error);
      return null;
    }
  };

  const fetchEmployees = useCallback(
    async (page = 1) => {
      try {
        let authToken = token || localStorage.getItem('authToken');

        if (!authToken) {
          authToken = await fetchToken();
        }

        if (!authToken) {
          console.error('유효한 인증 토큰을 가져오지 못했습니다.');
          return;
        }

        const response = await axios.get(
          'https://hrmaster.store/api/employees',
          {
            params: {
              page: page,
              size: itemsPerPage,
              sort: 'createdAt,desc',
            },
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
            withCredentials: false,
          }
        );

        if (response.data && response.data.data) {
          const { data } = response.data;
          // 여기서 employeeId를 명시적으로 추가
          const enrichedData = (data.responseDTOList || []).map(employee => ({
            ...employee,
            employeeId: employee.employeeId || employee.empNum,
          }));

          setApiData(enrichedData);
          setFilteredData(enrichedData);
          setTotalPages(data.totalPages || 1);
        }
      } catch (error) {
        console.error('직원 정보 가져오기 오류:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    },
    [token, itemsPerPage]
  );

  useEffect(() => {
    const initializeAuth = async () => {
      let authToken = localStorage.getItem('authToken');

      if (!authToken) {
        authToken = await fetchToken();
      }

      if (authToken) {
        setToken(authToken);
        await fetchEmployees(1);
      } else {
        console.error('로그인 실패: 토큰을 받아오지 못했습니다.');
      }
    };

    initializeAuth();
  }, [fetchEmployees]);

  const handleSearch = useCallback(() => {
    const result = apiData.filter(item => {
      const companyMatch =
        selectedCompany === '전체' || item.department === selectedCompany;
      const departmentMatch =
        selectedDepartment === '전체' || item.teamname === selectedDepartment;
      const searchMatch =
        !searchValue ||
        (item[searchType]?.toLowerCase() || '').includes(
          searchValue.toLowerCase()
        );

      return companyMatch && departmentMatch && searchMatch;
    });

    setFilteredData(result);
    setCurrentPage(1);
  }, [apiData, selectedCompany, selectedDepartment, searchType, searchValue]);

  const handleCompanyChange = value => {
    setSelectedCompany(value);
    setSelectedDepartment('전체');
  };

  const handleFetchAll = () => {
    setFilteredData(apiData);
    setCurrentPage(1);
  };

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="employee-search-container">
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
        onDepartmentChange={setSelectedDepartment}
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
        onPageChange={({ selected }) => setCurrentPage(selected + 1)}
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
        forcePage={currentPage - 1}
      />
    </div>
  );
};

export default EmployeeSearch;
