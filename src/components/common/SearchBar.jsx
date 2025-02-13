import React from 'react';
import '../../styles/SearchBar.scss';
import Button from '../common/Button';
import TextField from '../common/TextField';

export function SearchBar({
  companies,
  departments,
  selectedCompany,
  selectedDepartment,
  searchType,
  searchValue,
  searchOptions,
  onCompanyChange,
  onDepartmentChange,
  onSearchTypeChange,
  onSearchValueChange,
  onFetchAll,
  onSearch,
}) {
  return (
    <div className="EmployeeSearch">
      
      <div className="search-bar">
        <Button
          buttonSize="smallButton"
          buttonColor="light"
          type="button"
          action={onFetchAll}
        >
          전체 조회
        </Button>
        {/* 계열사 선택 드롭다운 */}
        <select
          value={selectedCompany}
          onChange={e => onCompanyChange(e.target.value)}
        >
          {companies.map(company => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        {/* 부서 선택 드롭다운 */}
        <select
          value={selectedDepartment}
          onChange={e => onDepartmentChange(e.target.value)}
        >
          {departments.map(department => (
            <option key={department} value={department}>
              {department}
            </option>
          ))}
        </select>

        {/* 검색 유형 선택 드롭다운 */}
        <select
          value={searchType}
          onChange={e => onSearchTypeChange(e.target.value)}
        >
          {searchOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <TextField
          name="search"
          size="small"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={e => onSearchValueChange(e.target.value)}
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
