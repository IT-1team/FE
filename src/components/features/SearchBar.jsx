import React from 'react';
import "../../styles/SearchBar.scss"

export function SearchBar({
  searchType,
  setSearchType,
  searchValue,
  setSearchValue,
  onFetchAll,
  onSearch,
}) {
  return (
    <div className="search-bar">
      <button className="fetch-all-btn" onClick={onFetchAll}>
        전체 조회
      </button>
      <select
        value={searchType}
        onChange={e => setSearchType(e.target.value)}
        className="search-select"
      >
        <option value="name">이름</option>
        <option value="empNum">사번</option>
        <option value="department">부서명</option>
      </select>
      <input
        type="text"
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)}
        placeholder="검색어를 입력하세요"
        className="search-input"
      />
      <button className="search-btn" onClick={onSearch}>
        검색
      </button>
    </div>
  );
}
