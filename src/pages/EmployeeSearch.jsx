import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { SearchBar } from '../components/common/SearchBar';
import { EmployeeTable } from '../components/features/EmployeeTable';
import '../styles/EmployeeSearch.scss';
import '../styles/pagination.scss';

//dummy 데이터
const dummyData = [
  { empNum: '12340', name: '김지원', department: 'IT 기획', rank: '대리' },
  { empNum: '12341', name: '박민수', department: '인사', rank: '과장' },
  { empNum: '12342', name: '이서연', department: '마케팅', rank: '사원' },
  { empNum: '12343', name: '최영훈', department: '영업', rank: '부장' },
  { empNum: '12344', name: '정하은', department: 'IT 기획', rank: '사원' },
  { empNum: '12345', name: '한지민', department: '재무', rank: '대리' },
  { empNum: '12346', name: '오세훈', department: 'IT 운영', rank: '과장' },
  { empNum: '12347', name: '김민재', department: '영업', rank: '사원' },
  { empNum: '12348', name: '박지성', department: '마케팅', rank: '대리' },
  { empNum: '12349', name: '손흥민', department: 'IT 기획', rank: '부장' },
  { empNum: '12350', name: '이강인', department: '인사', rank: '사원' },
  { empNum: '12351', name: '황희찬', department: '재무', rank: '과장' },
  { empNum: '12352', name: '조규성', department: 'IT 운영', rank: '대리' },
  { empNum: '12353', name: '김연아', department: '영업', rank: '사원' },
  { empNum: '12354', name: '유재석', department: '마케팅', rank: '부장' },
];

//검색 옵션
const searchOptions = [
  { value: 'name', label: '이름' },
  { value: 'empNum', label: '사번' },
  { value: 'department', label: '부서명' },
];

const EmployeeSearch = () => {
  // 상태 변수 정의
  const [searchType, setSearchType] = useState('name'); // 검색 유형
  const [searchValue, setSearchValue] = useState(''); //검색어
  const [filteredData, setFilteredData] = useState([]); //필터링된 데이터
  const [currentPage, setCurrentPage] = useState(0); //현재 페이지
  const itemsPerPage = 10;
  //const [postsPerPage] = useState(10);//페이지당 표시할 항목 수수
  // 전체 조회 핸들러
  const handleFetchAll = () => {
    setFilteredData(dummyData);
  };

  // 검색 핸들러
  const handleSearch = () => {
    const result = dummyData.filter(item =>
      item[searchType].includes(searchValue)
    );
    setFilteredData(result);
  };

  // 현재 페이지의 데이터 계산
  const offset = currentPage * itemsPerPage;
  const currentPageData = filteredData.slice(offset, offset + itemsPerPage);

  // 페이지 변경 핸들러
  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected);
  };

  //컴포넌트 마운트 시 전체 데이터 로드드
  useEffect(() => {
    setFilteredData(dummyData);
  }, []);

  return (
    <div>
      <SearchBar
        searchType={searchType}
        setSearchType={setSearchType}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
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
