import React from 'react';
import { oneOfType, node, arrayOf } from 'prop-types';

import './NotificationsList.sass';

const NotificationsList = ({ children }) => (
  <ul className="notifications__list">
    {children}
  </ul>
);

NotificationsList.propTypes = {
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

export default NotificationsList;
