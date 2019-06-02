import React, { useContext } from 'react';
import { bool } from 'prop-types';
import NotificationsContainer from '../NotificationsContainer';
import Badge from '../Badge';
import NotificationsHeader from '../NotificationHeader';
import NotificationsHeaderActions from '../NotificationsHeaderActions';
import NotificationsList from '../NotificationsList';
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
        .findIndex(({ _id }) => _id === notificationId);

      draft.notifications[notificationIndex].isRead = true;
    });
  };

  const deleteNotification = (notificationId) => {
    setLoggedUser((draft) => {
      const notificationIndex = notifications
        .findIndex(({ _id }) => _id === notificationId);

      draft.notifications.splice(notificationIndex, 1);
    });
  };

  if (!isOpen) return <Badge num={numOfUnreadNotifications} />;

  return (
    <>
      <Badge num={numOfUnreadNotifications} />
      <NotificationsContainer classes="notifications">
        <NotificationsHeader title="Notifications">
          <NotificationsHeaderActions
            unreadNotificationsIds={unreadNotificationsIds}
          />
        </NotificationsHeader>
        {notifications.length > 0 && (
          <NotificationsList>
            {notifications.map(notification => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                readNotificationCb={() => markAsRead(notification._id)}
                deleteNotificationCb={() => deleteNotification(notification._id)}
              />
            ))}
          </NotificationsList>
        )}
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
