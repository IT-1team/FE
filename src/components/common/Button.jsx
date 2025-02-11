import React from 'react';
import '../../styles/Button.scss';

const Button = ({children, btnOn, buttonSize, buttonColor, action }) => {
  return (
    <button
      onClick={() => action()}
      disabled={btnOn}
      className={`Button ${buttonSize} ${buttonColor}`}
    >
      {children}
    </button>
  );
};

export default Button;
