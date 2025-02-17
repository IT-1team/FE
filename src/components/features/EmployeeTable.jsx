import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/EmployeeTable.scss';

export function EmployeeTable({ data }) {
  const navigate = useNavigate();
  console.log('Employee Data:', data);

  return (
    <div className="employee-table">
      <table>
        <thead>
          <tr key="header">
            <th key="header-empNum">사번</th>
            <th key="header-name">이름</th>
            <th key="header-department">부서명</th>
            <th key="header-team">팀명</th>
            <th key="header-rank">직급</th>
            <th key="header-phone">연락처</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr key="no-data-row">
              <td key="no-data-cell" colSpan="6">
                데이터 없음
              </td>
            </tr>
          ) : (
            data.map((employee, index) => (
              <tr
                key={`row-${employee.empNUM}-${index}`}
                onClick={() =>
                  navigate(`/dashboard/search/${employee.employeeId}`)
                }
                style={{ cursor: 'pointer' }}
                className="hover-row"
              >
                <td key={`cell-empNum-${employee.empNUM}-${index}`}>
                  {employee.empNUM}
                </td>
                <td key={`cell-name-${employee.empNUM}-${index}`}>
                  {employee.name}
                </td>
                <td key={`cell-department-${employee.empNUM}-${index}`}>
                  {employee.departmentName}
                </td>
                <td key={`cell-teamname-${employee.empNUM}-${index}`}>
                  {employee.teamName}
                </td>
                <td key={`cell-rank-${employee.empNUM}-${index}`}>
                  {employee.emRank}
                </td>
                <td key={`cell-phoneNum-${employee.empNUM}-${index}`}>
                  {employee.phoneNum}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
