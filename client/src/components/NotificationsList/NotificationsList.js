import React from 'react';
import {
  oneOfType, node, arrayOf, string,
} from 'prop-types';
import SimpleBar from 'simplebar-react';

import './NotificationsList.sass';

const NotificationsList = ({ children, classes }) => (
  <SimpleBar>
    <ul className={`notifications__list ${classes}`}>
      {children}
    </ul>
  </SimpleBar>
);

NotificationsList.propTypes = {
  classes: string,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

NotificationsList.defaultProps = {
  classes: '',
};

export default NotificationsList;
