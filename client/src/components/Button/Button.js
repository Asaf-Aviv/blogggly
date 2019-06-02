import React from 'react';
import {
  oneOf, func, string, bool,
} from 'prop-types';

const Button = ({
  classes, type, onClick, text, disabled,
}) => (
  <button
    className={classes}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
  </button>
);

Button.propTypes = {
  type: oneOf(['button', 'submit']),
  onClick: func.isRequired,
  classes: string,
  text: string,
  disabled: bool,
};

Button.defaultProps = {
  type: 'button',
  classes: '',
  text: '',
  disabled: false,
};

export default Button;
