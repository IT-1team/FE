import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/features/SearchBar';
import { EmployeeTable } from '../components/features/EmployeeTable';
import Pagination from '../components/common/Pagination';
import '../styles/EmployeeSearch.scss';

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
  { empNum: '123410', name: '이강인', department: '인사', rank: '사원' },
  { empNum: '123411', name: '황희찬', department: '재무', rank: '과장' },
  { empNum: '123412', name: '조규성', department: 'IT 운영', rank: '대리' },
  { empNum: '123413', name: '김연아', department: '영업', rank: '사원' },
  { empNum: '123414', name: '유재석', department: '마케팅', rank: '부장' },
];

//검색 옵션
const searchOptions = [
  { value: 'name', label: '이름' },
  { value: 'empNum', label: '사번' },
  { value: 'department', label: '부서명' },
];

const EmployeeSearch = () => {
  const [searchType, setSearchType] = useState('name');
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
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
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredData.slice(indexOfFirstPost, indexOfLastPost);

  // 페이지 변경 핸들러
  const paginate = pageNumber => setCurrentPage(pageNumber);

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
      <EmployeeTable data={currentPosts} />
      <Pagination
        postsPerPage={postsPerPage}
        totalPosts={filteredData.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

export default EmployeeSearch;
