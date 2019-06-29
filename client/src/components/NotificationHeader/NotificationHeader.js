import React from 'react';
import {
  string, arrayOf, oneOfType, node,
} from 'prop-types';

import './NotificationsHeader.sass';

const NotificationsHeader = ({ title, children }) => (
  <div className="notifications__header">
    <h5 className="bold">{title}</h5>
    <div className="notifications__actions">
      {children}
    </div>
  </div>
);

NotificationsHeader.propTypes = {
  title: string.isRequired,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

export default NotificationsHeader;
