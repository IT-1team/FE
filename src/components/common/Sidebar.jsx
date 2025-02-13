import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // useLocation 추가
import logo from '../../assets/logo.png';
import '../../styles/Sidebar.scss';
function Sidebar() {
  const location = useLocation(); // 현재 경로 확인을 위한 hook

  const menuItems = [
    { path: '/dashboard/registration', label: '사원 정보 등록' },
    { path: '/dashboard/search', label: '사원 조회' },
    { path: '/dashboard/attendance', label: '근태 관리' },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="Seohan HR" />
      </div>
      <nav className="nav-menu">
        <div className="menu-group">
          <ul>
            {menuItems.map(item => {
              return (
                <li
                  key={item.path}
                  className={location.pathname === item.path ? 'active' : ''}
                >
                  <Link to={item.path}>{item.label}</Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
