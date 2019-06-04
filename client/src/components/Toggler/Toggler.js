import React, { useRef } from 'react';
import { func, bool } from 'prop-types';

import './Toggler.sass';

const Toggler = ({ checked, onChange }) => {
  const checkboxRef = useRef();

  const forwardClick = () => {
    checkboxRef.current.click();
  };

  return (
    <div className="toggler__container">
      <input
        ref={checkboxRef}
        className="toggle__input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className="toggle" onClick={forwardClick} />
    </div>
  );
};

Toggler.propTypes = {
  checked: bool.isRequired,
  onChange: func.isRequired,
};

export default Toggler;
