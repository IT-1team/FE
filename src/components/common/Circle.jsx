import React from 'react';
import '../../styles/Circle.scss';

const Circle = ({
  src,
  alt,
  size = 'md',
  border = true,
  className = '',
  icon: IconComponent,
  label = '',
}) => {
  return (
    <div className="circle-container">
      <div
        className={`profile-circle profile-circle--${size} ${
          border ? 'profile-circle--border' : ''
        } ${className}`}
      >
        {IconComponent ? (
          <IconComponent className="profile-circle__icon" />
        ) : (
          src && <img src={src} alt={alt} className="profile-circle__image" />
        )}
      </div>
      {label && <div className="circle-label">{label}</div>}
    </div>
  );
};

export default Circle;
