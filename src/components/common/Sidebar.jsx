import React from 'react';
import {
  Users,
  Settings,
  Network,
  FileText,
  Bell,
  HelpCircle,
} from 'lucide-react';
import '../../styles/Sidebar.scss';

const Sidebar = () => {
  const menuItems = [
    { icon: Users, label: '사원 정보 등록', badge: null },
    { icon: Settings, label: '사원 조회', badge: null },
    { icon: Network, label: '네트워크 관리', badge: null },
    { icon: FileText, label: '로그 관리', badge: null },
    { icon: Settings, label: '일반 설정', badge: null },
    { icon: Network, label: '네트워크 검사', badge: null },
    { icon: Bell, label: '알림 센터', badge: 2 },
    { icon: HelpCircle, label: '도움말', badge: null },
  ];

  return (
    <div className="sidebar">
      <div className="header">
        <div className="header__content">
          <div className="header__icon">
            <Network />
          </div>
          <div className="header__text">
            <h1>관리자 패널</h1>
            <p>시스템 관리</p>
          </div>
        </div>
      </div>

      <nav className="nav-menu">
        {menuItems.map((item, index) => (
          <div key={index} className="nav-menu__item">
            <item.icon />
            <span>{item.label}</span>
            {item.badge && <span className="badge">{item.badge}</span>}
          </div>
        ))}
      </nav>

      <div className="profile">
        <div className="profile__avatar">
          <Users />
        </div>
        <div className="profile__info">
          <p>관리자</p>
          <p>admin@company.com</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
