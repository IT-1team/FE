import React from 'react';
import '../../styles/SearchBar.scss';
import Button from './Button';
import TextField from './TextField';

export function SearchBar({
  searchType,
  setSearchType,
  searchValue,
  setSearchValue,
  onFetchAll,
  onSearch,
}) {
  return (
    <div className="EmployeeSearch">
      <h2>사원 조회</h2>
      <div className="search-bar">
        <Button
          buttonSize="smallButton"
          buttonColor="light"
          type="button"
          action={onFetchAll}
        >
          전체 조회
        </Button>
        <select
          value={searchType}
          onChange={e => setSearchType(e.target.value)}
          className="search-select"
        >
          <option value="name">이름</option>
          <option value="empNum">사번</option>
          <option value="department">부서명</option>
        </select>

        <TextField
          name="search"
          size="small"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <Button
          buttonSize="smallButton"
          buttonColor="dark"
          type="button"
          action={onSearch}
        >
          검색
        </Button>
      </div>
    </div>
  );
}
