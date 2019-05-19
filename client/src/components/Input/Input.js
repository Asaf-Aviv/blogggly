import React, { useEffect, useState } from 'react';
import { bool, string, func } from 'prop-types';
import useDebouncedCallback from 'use-debounce/lib/callback';

import './Input.sass';

const Input = ({
  inputType,
  classes,
  autoComplete,
  value,
  onChange,
  placeholder,
  iconClasses,
  tooltipText,
  validateFunc,
  required,
  disabled,
}) => {
  const [isValid, setIsValid] = useState(false);

  const [debouncedCallback] = useDebouncedCallback(
    () => setIsValid(validateFunc(value)),
    300, [value],
  );

  useEffect(() => {
    if (validateFunc && value.length > 3) {
      debouncedCallback(value);
    }
  }, [value, debouncedCallback, validateFunc]);

  return (
    <div className="input__wrapper">
      <div className="input__container">
        {iconClasses && (
          <i className={`input__icon ${iconClasses}`} />
        )}
        <input
          className={`input ${iconClasses ? 'input--with-icon' : ''} ${classes}`}
          autoComplete={autoComplete ? 'true' : 'false'}
          type={inputType}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={!!disabled}
        />
        {validateFunc && value.length > 3 && (
          <>
            {isValid
              ? <i className="input__valid fas fa-check" />
              : <i className="input__invalid fas fa-times" />
            }
          </>
        )}
        {tooltipText && (
          <div className="tooltip">
            <i className="tooltip__icon fas fa-info-circle" />
            <div className="tooltip__inner">
              <span className="tooltip__text">
                {tooltipText}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Input.propTypes = {
  inputType: string,
  classes: string,
  tooltipText: string,
  iconClasses: string,
  placeholder: string,
  value: string,
  autoComplete: bool,
  required: bool,
  disabled: bool,
  validateFunc: func,
  onChange: func,
};

Input.defaultProps = {
  inputType: 'text',
  classes: '',
  tooltipText: '',
  iconClasses: '',
  placeholder: '',
  value: '',
  autoComplete: false,
  required: false,
  disabled: false,
  validateFunc: null,
  onChange: () => {},
};


export default Input;
