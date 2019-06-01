import React, { useContext } from 'react';
import { bool } from 'prop-types';
import NotificationsContainer from '../NotificationsContainer';
import Badge from '../Badge';
import NotificationsHeader from '../NotificationHeader';
import NotificationItem from '../NotificationItem';
import { UserContext } from '../../context';

import './Notifications.sass';

const Notifications = ({ isOpen }) => {
  const { setLoggedUser, loggedUser, loggedUser: { notifications } } = useContext(UserContext);

  const unreadNotificationsIds = notifications
    .reduce((ids, { _id, isRead }) => {
      if (!isRead) ids.push(_id);
      return ids;
    }, []);

  const numOfUnreadNotifications = unreadNotificationsIds.length;

  const markAsRead = (notificationId) => {
    setLoggedUser((draft) => {
      const notificationIndex = notifications
        .findIndex(notification => notification._id === notificationId);

      draft.notifications[notificationIndex].isRead = true;
    });
  };

  const deleteNotification = (notificationId) => {
    setLoggedUser((draft) => {
      const notificationIndex = notifications
        .findIndex(notification => notification._id === notificationId);

      draft.notifications.splice(notificationIndex, 1);
    });
  };

  if (!isOpen) return <Badge num={numOfUnreadNotifications} />;

  return (
    <>
      <Badge num={numOfUnreadNotifications} />
      <NotificationsContainer classes="notifications">
        <NotificationsHeader
          unreadNotificationsIds={unreadNotificationsIds}
          disableDeleteAll={!loggedUser.notifications.length}
        />
        <ul className="notifications__list">
          {notifications.map(notification => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              readNotificationCb={() => markAsRead(notification._id)}
              deleteNotificationCb={() => deleteNotification(notification._id)}
            />
          ))}
        </ul>
      </NotificationsContainer>
    </>
  );
};

Notifications.propTypes = {
  isOpen: bool,
};

// define default props to avoid cloneElement proptypes
// error because elements are checked at the creation time
Notifications.defaultProps = {
  isOpen: false,
};

export default Notifications;
