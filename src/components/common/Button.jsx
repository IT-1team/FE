import React from 'react';
import '../../styles/Button.scss';

const Button = ({ btnOn, buttonSize, buttonColor, children, action }) => {
  return (
    <button
      onClick={() => action()}
      disabled={btnOn}
      className={`${buttonSize} ${buttonColor}`}
    >
      {children}
    </button>
  );
};

export default Button;
