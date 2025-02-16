import React from 'react';
import '../../styles/ProgressBar.scss';

const ProgressBar = ({ label, current, total, color }) => {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  return (
    <div className="prograss-bar">
      <div className="progress-bar__header">
        <span className="progress-bar__label">{label}</span>
        <span className="progress-bar__count">
          <span className="current" style={{ color }}>
            {current}
          </span>
          <span className="separator">/</span>
          <span className="total">{total}</span>
        </span>
      </div>
      <div className="progress-bar__container">
        <div
          className="progress-bar__fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
