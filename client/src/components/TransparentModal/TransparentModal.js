import React from 'react';
import {
  arrayOf, node, func, oneOfType,
} from 'prop-types';

import './TransparentModal.sass';

const TransparentModal = ({ onBackgroundClick, children }) => (
  <div className="modal" onClick={onBackgroundClick}>
    {children}
  </div>
);

TransparentModal.propTypes = {
  onBackgroundClick: func.isRequired,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

export default TransparentModal;
