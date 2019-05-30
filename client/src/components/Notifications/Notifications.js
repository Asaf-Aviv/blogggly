import React, { useContext } from 'react';
import { bool, func } from 'prop-types';
import NotificationsContainer from '../NotificationsContainer';
import Badge from '../Badge';
import { UserContext } from '../../context';

import './Notifications.sass';

const Notifications = ({ isOpen, isOpenToggler }) => {
  const { loggedUser: { notifications } } = useContext(UserContext);
  const numOfNotifications = notifications.length;

  if (!isOpen) return <Badge num={numOfNotifications} />;

  return (
    <>
      <Badge num={numOfNotifications} />
      <NotificationsContainer classes="notitications" />
    </>
  );
};

Notifications.propTypes = {
  isOpen: bool,
  isOpenToggler: func,
};

// define default props to avoid cloneElement proptypes
// error because elements are checked at the creation time
Notifications.defaultProps = {
  isOpen: false,
  isOpenToggler: () => {},
};

export default Notifications;
