import React from 'react';
import {
  node, string, oneOfType, arrayOf,
} from 'prop-types';
import EmptySentence from '../EmptySentence';

import './NotificationsContainer.sass';

const NotificationsContainer = ({ classes, children }) => (
  <div className={`notifications__container ${classes}`} onClick={e => e.stopPropagation()}>
    {children}
    {children.length <= 2 && !children.every(Boolean) && <EmptySentence />}
  </div>
);

NotificationsContainer.propTypes = {
  classes: string,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

NotificationsContainer.defaultProps = {
  classes: '',
};

export default NotificationsContainer;
