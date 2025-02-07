import React from "react";

export const EmployeeForm = ({ employeeData, onChange, onSubmit, onAddressClick }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>이름</label>
          <input
            type="text"
            name="name"
            value={employeeData.name}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>입사일자</label>
          <input
            type="text"
            name="hireDate"
            value={employeeData.hireDate}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>사번</label>
          <input
            type="text"
            name="empNum"
            value={employeeData.empNum}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>연락처</label>
          <input
            type="text"
            name="phoneNum"
            value={employeeData.phoneNum}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>부서명</label>
          <input
            type="text"
            name="departmentName"
            value={employeeData.departmentName}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>팀명</label>
          <input
            type="text"
            name="teamName"
            value={employeeData.teamName}
            onChange={onChange}
          />
        </div>

        {/* 주소 입력 필드 */}
        <div className="form-row address-row">
          <label>주소</label>
          <div className="address-main">
            <input
              type="text"
              name="address"
              value={employeeData.address}
              readOnly
              placeholder="기본주소"
            />
            <button
              type="button"
              onClick={onAddressClick}
              className="address-search-btn"
            >
              주소 검색
            </button>
          </div>
          <div className="address-sub">
            <input
              type="text"
              name="detailAddress"
              value={employeeData.detailAddress}
              onChange={onChange}
              placeholder="상세주소"
            />
            <input
              type="text"
              name="zipCode"
              value={employeeData.zipCode}
              readOnly
              placeholder="우편번호"
            />
          </div>
        </div>

        <div className="form-group">
          <label>직급</label>
          <input
            type="text"
            name="rank"
            value={employeeData.rank}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>임금</label>
          <input
            type="text"
            name="salary"
            value={employeeData.salary}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            name="email"
            value={employeeData.email}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="submit-btn">
          사원 등록
        </button>
      </div>
    </form>
  );
}

