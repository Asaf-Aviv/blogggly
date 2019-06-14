import React from 'react';
import Notifications from '../Notifications';
import FriendRequestNotifications from '../FriendRequestNotifications';
import NavNotification from '../NavNotifications';

const NotificationsWrapper = () => (
  <>
    <NavNotification iconClass="fas fa-bell animated bounceIn fast delay-100ms">
      <Notifications />
    </NavNotification>
    <NavNotification iconClass="fas fa-user-plus animated bounceIn fast delay-200ms">
      <FriendRequestNotifications />
    </NavNotification>
  </>
);

export default NotificationsWrapper;
