import React from 'react';
import '../styles/TextField.scss';

const TextField = ({
  size = 'medium',
  placeholder = '',
  value,
  onChange,
  ...props
}) => {
  const sizeClass = `text-field--${size}`;

  return (
    <input
      type="text"
      className={`text-field ${sizeClass}`}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};
export default TextField;
