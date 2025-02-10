import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '/src/styles/Login.scss';

function Login() {
  const navigate = useNavigate();
  // 사용자 입력값을 관리하는 state
  const [credentials, setCredentials] = useState({
    id: '',
    password: '',
  });

  // 폼 제출 처리 함수
  const handleSubmit = e => {
    e.preventDefault();
    console.log('Login attempted with:', credentials);
    navigate('/dashboard/registration');
  };

  // 입력값 변경 처리 함수
  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {/* 로고 영역 */}
        <div className="login-header">
          <img src="/src/assets/logo.png" alt="Seohan HR" className="logo" />
        </div>
        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="id"
              placeholder="ID"
              value={credentials.id}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="PW"
              value={credentials.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
