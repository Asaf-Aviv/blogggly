import React from 'react';
import {
  oneOfType, node, arrayOf, string,
} from 'prop-types';

import './NotificationsList.sass';

const NotificationsList = ({ children, classes }) => (
  <ul className={`notifications__list ${classes}`} data-simplebar>
    <div>
      {children}
    </div>
  </ul>
);

NotificationsList.propTypes = {
  classes: string,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

NotificationsList.defaultProps = {
  classes: '',
};

export default NotificationsList;
