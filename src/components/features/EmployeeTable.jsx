import React from 'react';
import "../../styles/EmployeeTable.scss"

export function EmployeeTable({ data }) {
  return (
    <div className="employee-table">
      <table>
        <thead>
          <tr>
            <th>사번</th>
            <th>이름</th>
            <th>부서명</th>
            <th>팀명</th>
            <th>직급</th>
            <th>연락처</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(employee => (
              <tr key={employee.empNum}>
                <td>{employee.empNum}</td>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.teamname}</td>
                <td>{employee.rank}</td>
                <td>{employee.phoneNum}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">데이터 없음</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
