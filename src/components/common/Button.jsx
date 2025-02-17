import React from 'react';
import '../../styles/Button.scss';

const Button = ({
  btnOn = false,
  buttonSize,
  buttonColor,
  children,
  type = 'button',
  onClick, // 추가된 부분
}) => {
  return (
    <button
      type={type}
      disabled={btnOn}
      className={`${buttonSize} ${buttonColor}`}
      onClick={onClick} // 추가된 부분
    >
      {children}
    </button>
  );
};

export default Button;
