import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { API_PATH } from '../../api/instance/instance';

/**
 * @typedef {Object} LoginRequest
 * @property {string} loginId - 로그인 아이디 (최대 20자)
 * @property {string} password - 비밀번호 (최대 20자)
 */

/**
 * @typedef {Object} LoginResponse
 * @property {string} message - 응답 메시지
 * @property {Object} data - 응답 데이터
 * @property {number} data.adminId - 관리자 ID
 * @property {string} data.loginId - 로그인 ID
 * @property {string} data.accessToken - 접근 토큰
 */

// endpoints
export const authEndpoints = {
  login: () => ({
    url: `${API_PATH.BASE_URL}${API_PATH.AUTH.LOGIN}`,
  }),
};

/**
 * 로그인 API 호출 함수
 * @param {LoginRequest} credentials - 로그인 정보
 * @returns {Promise<LoginResponse>} 로그인 응답
 */
const loginUser = async credentials => {
  const { url } = authEndpoints.login();
  const response = await axios.post(url, credentials);
  return response.data;
};

// Custom Hook
export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: data => {
      // 로그인 성공 시 처리
      console.log('로그인 성공:', data.message);
      // accessToken 저장
      localStorage.setItem('accessToken', data.data.accessToken);
    },
    onError: error => {
      // 에러 처리
      console.error('로그인 실패:', error);
    },
  });
};
