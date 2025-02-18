import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import '/src/styles/Login.scss';
import logoImage from '/logo.png';

function Login() {
  const navigate = useNavigate();
  // 사용자 입력값을 관리하는 state
  const [credentials, setCredentials] = useState({
    id: '',
    password: '',
  });

  // 입력값 변경 처리 함수
  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 처리 함수
  const handleSubmit = e => {
    e.preventDefault();

    login(credentials, {
      onSuccess: data => {
        console.log('전체 로그인 응답:', data);

        if (typeof window !== 'undefined') {
          console.log('window 존재함');
          console.log('localStorage 사용 가능:', !!window.localStorage);

          try {
            const token = data.token;
            localStorage.setItem('accessToken', token);
            console.log('토큰 저장 성공');
          } catch (error) {
            console.error('토큰 저장 실패:', error);
          }
        } else {
          console.error('window 객체 없음');
        }

        navigate('/dashboard');
      },
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={logoImage} alt="Seohan HR" className="logo" />
        </div>
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
          <Button
            btnOn={!credentials.id || !credentials.password}
            buttonSize="bigButton"
            buttonColor="dark"
            type="submit"
          >
            로그인
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
