import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
import RouterPath from '../router/RouterPath';
import '../styles/EmployeeDetail.scss';

const EmployeeDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployeeDetail = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(
          `https://hrmaster.store/api/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setEmployee(response.data.data);
        setEditedEmployee(response.data.data);
        setLoading(false);
      } catch (error) {
        setError('사원 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    fetchEmployeeDetail();
  }, [id]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setEditedEmployee(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEmployee = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `https://hrmaster.store/api/employees/${id}`,
        editedEmployee,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setEmployee(editedEmployee);
      setIsEditing(false);
      alert('사원 정보가 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('사원 정보 수정 중 오류 발생:', error);
      alert('사원 정보 수정에 실패했습니다.');
    }
  };

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!employee) return <div>사원 정보를 찾을 수 없습니다.</div>;

  return (
    <div className="employee-registration">
      <h2>사원 상세 정보</h2>
      <form>
        {/* 기본 정보 */}
        <div className="info-group">
          <h3>기본 정보</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>이름</label>
              <TextField
                name="name"
                size="medium"
                value={isEditing ? editedEmployee.name : employee.name}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
            <div className="form-group">
              <label>재직여부</label>
              <TextField
                name="status"
                size="medium"
                value={isEditing ? editedEmployee.status : employee.status}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
            <div className="form-group">
              <label>연락처</label>
              <TextField
                name="phoneNum"
                size="medium"
                value={isEditing ? editedEmployee.phoneNum : employee.phoneNum}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
          </div>
        </div>

        {/* 소속 정보 */}
        <div className="info-group">
          <h3>소속 정보</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>부서명</label>
              <TextField
                name="departmentName"
                size="medium"
                value={
                  isEditing
                    ? editedEmployee.departmentName
                    : employee.departmentName
                }
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
            <div className="form-group">
              <label>팀명</label>
              <TextField
                name="teamName"
                size="medium"
                value={isEditing ? editedEmployee.teamName : employee.teamName}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
          </div>
        </div>

        {/* 주소 정보 */}
        <div className="info-group">
          <h3>주소 정보</h3>
          <div className="address-row">
            <label>주소</label>
            <div className="address-main">
              <TextField
                name="address"
                size="small"
                value={isEditing ? editedEmployee.address : employee.address}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
            <div className="address-sub">
              <TextField
                name="address2"
                size="small"
                value={isEditing ? editedEmployee.address2 : employee.address2}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
          </div>
        </div>

        {/* 근무 정보 */}
        <div className="info-group">
          <h3>근무 정보</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>직급</label>
              <TextField
                name="emRank"
                size="medium"
                value={isEditing ? editedEmployee.emRank : employee.emRank}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
            <div className="form-group">
              <label>입사일자</label>
              <TextField
                name="hireDate"
                size="medium"
                value={isEditing ? editedEmployee.hireDate : employee.hireDate}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
            <div className="form-group">
              <label>임금</label>
              <TextField
                name="salary"
                size="medium"
                value={isEditing ? editedEmployee.salary : employee.salary}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
            <div className="form-group">
              <label>이메일</label>
              <TextField
                name="email"
                size="medium"
                value={isEditing ? editedEmployee.email : employee.email}
                readOnly={!isEditing}
                onChange={isEditing ? handleInputChange : undefined}
              />
            </div>
          </div>
        </div>

        <div className="button-group">
          <Button
            buttonSize="smallButton"
            buttonColor="light"
            type="button"
            onClick={() => navigate(RouterPath.SEARCH)}
          >
            목록으로
          </Button>
          {!isEditing ? (
            <Button
              buttonSize="smallButton"
              buttonColor="dark"
              type="button"
              onClick={() => setIsEditing(true)}
            >
              수정하기
            </Button>
          ) : (
            <Button
              buttonSize="smallButton"
              buttonColor="dark"
              type="button"
              onClick={handleSaveEmployee}
            >
              수정 완료
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
export default EmployeeDetail;
