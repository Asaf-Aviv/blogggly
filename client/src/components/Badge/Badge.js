import React from 'react';
import { number } from 'prop-types';

import './Badge.sass';

const Badge = ({ num }) => (
  num
    ? <span className="badge">{num}</span>
    : null
);

Badge.propTypes = {
  num: number.isRequired,
};

export default Badge;
