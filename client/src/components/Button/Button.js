import React from 'react';
import {
  oneOf, func, string, bool, oneOfType, node, arrayOf,
} from 'prop-types';

const Button = ({
  classes, type, onClick, text, disabled, children,
}) => (
  <button
    className={classes}
    type={type}
    onClick={onClick}
    disabled={disabled}
  >
    {text}
    {children}
  </button>
);

Button.propTypes = {
  type: oneOf(['button', 'submit']),
  onClick: func.isRequired,
  classes: string,
  text: string,
  disabled: bool,
  children: oneOfType([node, arrayOf(node)]),
};

Button.defaultProps = {
  type: 'button',
  classes: '',
  text: '',
  disabled: false,
  children: null,
};

export default Button;
