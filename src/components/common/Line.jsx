import React from 'react';

const Line = ({ className, ...props }) => {
  return <div className={`line ${className || ''}`} {...props} />;
};

export default Line;
