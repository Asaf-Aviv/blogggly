import React, { useEffect } from 'react';
import {
  arrayOf, node, func, oneOfType,
} from 'prop-types';
import utils from '../../utils';

import './TransparentModal.sass';

const TransparentModal = ({ onBackgroundClick, children }) => {
  useEffect(() => {
    utils.lockScrollBody();
    return () => utils.unlockScrollBody();
  }, []);

  return (
    <div className="modal animated zoomIn faster" onClick={onBackgroundClick}>
      {children}
    </div>
  );
};

TransparentModal.propTypes = {
  onBackgroundClick: func.isRequired,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

export default TransparentModal;
