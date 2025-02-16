import React from 'react';
import '../../styles/Button.scss';

const Button = ({
  btnOn = false,
  buttonSize,
  buttonColor,
  children,
  type = 'button',
}) => {
  return (
    <button
      type={type}
      disabled={btnOn}
      className={`${buttonSize} ${buttonColor}`}
    >
      {children}
    </button>
  );
};

export default Button;
