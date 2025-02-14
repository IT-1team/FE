import React from 'react';
import '../../styles/StatusButton.scss';

const StatusButton = ({ label, count, type, isActive, onClick }) => {
  return (
    <div
      className={`status-button ${type} ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      <span>{label}</span>
      <span className="count">{count}건</span>
    </div>
  );
};

export default StatusButton;
