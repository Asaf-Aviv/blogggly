import React from 'react';
import { oneOf, func, string } from 'prop-types';


const Button = ({
  classes, type, onClick, text,
}) => (
  <button
    className={classes}
    type={type}
    onClick={onClick}
  >
    {text}
  </button>
);

Button.propTypes = {
  type: oneOf(['button', 'submit']),
  onClick: func.isRequired,
  classes: string,
  text: string,
};

Button.defaultProps = {
  type: 'button',
  classes: '',
  text: '',
};

export default Button;
