import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import { useLogin } from '../api/hooks/authAPI';
import '/src/styles/Login.scss';
import logoImage from '/logo.png';

function Login() {
  const navigate = useNavigate();
  const { mutate: login } = useLogin();
  // 사용자 입력값을 관리하는 state
  const [credentials, setCredentials] = useState({
    loginId: '',
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

        // data.data.accessToken으로 변경
        const token = data.data.accessToken;

        if (token) {
          localStorage.setItem('accessToken', token);
          console.log('토큰 저장 성공');
          navigate('/dashboard');
        } else {
          console.error('토큰을 찾을 수 없습니다.');
        }
      },
      onError: error => {
        console.error('로그인 실패:', error);
        alert('로그인에 실패했습니다.');
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
              name="loginId"
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
            btnOn={!credentials.loginId || !credentials.password}
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
