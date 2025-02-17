import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import '/src/styles/Login.scss';
import { useLogin } from '../api/hooks/authAPI';

function Login() {
  const navigate = useNavigate();
  // 사용자 입력값을 관리하는 state
  const [credentials, setCredentials] = useState({
    loginId: '',
    password: '',
  });

  //useLogin hook 사용
  const { mutate: login, isLoading } = useLogin();

  // 입력값 변경 처리 함수
  const handleChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 처리 함수
  const handleSubmit = (e = null) => {
    e.preventDefault();

    login(credentials, {
      onSuccess: data => {
        console.log('로그인 성공:', data.message);
        //대시 보드로 이동
        navigate('./dashboard');
      },
      onError: error => {
        console.error('로그인 실패', error);
        alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
      },
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/src/assets/logo.png" alt="Seohan HR" className="logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="loginId"
              placeholder="ID"
              value={credentials.loginId}
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
            disabled={isLoading}
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Login;
