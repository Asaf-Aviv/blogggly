import React from 'react';
import { node, string } from 'prop-types';
import EmptySentence from '../EmptySentence';

import './NotificationsContainer.sass';

const NotificationsContainer = ({ classes, children }) => (
  <div className={`notifications__container ${classes}`} onClick={e => e.stopPropagation()}>
    {children || <EmptySentence />}
  </div>
);

NotificationsContainer.propTypes = {
  classes: string,
  children: node,
};

NotificationsContainer.defaultProps = {
  classes: '',
  children: null,
};

export default NotificationsContainer;
