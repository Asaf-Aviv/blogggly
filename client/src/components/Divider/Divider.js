import React from 'react';
import { oneOf } from 'prop-types';

import './Divider.sass';

const Divider = ({ size }) => <div className={`divider divider--${size}`} />;

Divider.propTypes = {
  size: oneOf(['xs', 'sm', 'md', 'lg']),
};

Divider.defaultProps = {
  size: 'sm',
};

export default Divider;
