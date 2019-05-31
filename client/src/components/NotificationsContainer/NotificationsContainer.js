import React from 'react';
import {
  node, string, oneOfType, arrayOf,
} from 'prop-types';
import EmptySentence from '../EmptySentence';

import './NotificationsContainer.sass';

const NotificationsContainer = ({ classes, children }) => (
  <div className={`notifications__container ${classes}`} onClick={e => e.stopPropagation()}>
    {children || <EmptySentence />}
  </div>
);

NotificationsContainer.propTypes = {
  classes: string,
  children: oneOfType([node, arrayOf(node)]),
};

NotificationsContainer.defaultProps = {
  classes: '',
  children: null,
};

export default NotificationsContainer;
