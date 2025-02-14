import React from 'react';
import "../../styles/EmployeeTable.scss"

const AttendanceTable = ({ data }) => {
  return (
    <div className="attendance-table">
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>이름</th>
            <th>부서</th>
            <th>팀</th>
            <th>직급</th>
            <th>출근 시간</th>
            <th>퇴근 시간</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.date || '-'}</td>
              <td>{item.name || '-'}</td>
              <td>{item.department || '-'}</td>
              <td>{item.team || '-'}</td>
              <td>{item.rank || '-'}</td>
              <td>{item.checkInTime || '-'}</td>
              <td>{item.checkOutTime || '-'}</td>
              <td
                className={`status ${
                  item.status === '정상' ? 'normal' : 'abnormal'
                }`}
              >
                {item.status || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
};

export default AttendanceTable;