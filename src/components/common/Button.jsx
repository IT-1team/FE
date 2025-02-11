import React from 'react';
import '../../styles/Button.scss';

const Button = ({
  btnOn = false,
  buttonSize,
  buttonColor,
  children,
  action,
  type = 'button',
}) => {
  const handleClick = () => {
    if (action) {
      action();
    }
  };

  return (
    <button
      type={type}
      onClick={() => action()}
      disabled={btnOn}
      className={`${buttonSize} ${buttonColor}`}
    >
      {children}
    </button>
  );
};

export default Button;
