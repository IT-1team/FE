import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import '../../styles/Layout.scss';
const Layout = () => {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
