// 전체 레이아웃 컴포넌트
import React from "react";
import Sidebar from "../pages/Sidebar";
import "../styles/Layout.css";

function Layout({ children }) {
  return (
    <div className="layout">
      {/* 사이드바 메뉴 */}
      <Sidebar />
      {/* 메인 컨텐츠 영역 */}
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
