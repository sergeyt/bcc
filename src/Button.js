import React from 'react';
import classNames from 'classnames';

import './Button.css';

const Button = ({
  className,
  label,
  size,
  onClick,  
}) => (
  <div
    onClick={onClick}
    className={classNames('button', className)}
    data-size={size}
  >
    {label}
  </div>
);

export default Button;
