// Sidebar.js
import { Link, useLocation } from 'react-router-dom'; // useLocation 추가
import '../styles/Sidebar.css';

function Sidebar() {
  const location = useLocation(); // 현재 경로 확인을 위한 hook

  return (
    <div className="sidebar">
      <div className="logo">
        <img src="../src/assets/logo.png" alt="Seohan HR" />
      </div>
      <nav className="nav-menu">
        <div className="menu-group">
          <ul>
            <li
              className={location.pathname.includes('register') ? 'active' : ''}
            >
              <Link to="/dashboard/register">사원 정보 등록</Link>
            </li>
            <li
              className={location.pathname.includes('search') ? 'active' : ''}
            >
              <Link to="/dashboard/search">사원 조회</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
