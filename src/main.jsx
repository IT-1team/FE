// 메인 앱 컴포넌트
import React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import EmployeeRegistration from "./pages/EmployeeRegistration";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 기본 경로는 로그인 페이지로 설정 */}
        <Route path="/" element={<Login />} />
        {/* 대시보드 레이아웃 내부의 라우팅 */}
        <Route
          path="/dashboard/*"
          element={
            <Layout>
              <Routes>
                <Route
                  path="register"
                  element={<EmployeeRegistration />}
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}
// React 18의 새로운 렌더링 방식으로 앱 마운트
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
export default App;
