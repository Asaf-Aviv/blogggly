import React, { useContext } from 'react';
import { bool } from 'prop-types';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import NotificationsContainer from '../NotificationsContainer';
import queries from '../../graphql/queries';
import Badge from '../Badge';
import NotificationsHeader from '../NotificationHeader';
import NotificationsHeaderActions from '../NotificationsHeaderActions';
import NotificationsList from '../NotificationsList';
import NotificationItem from '../NotificationItem';
import { UserContext } from '../../context';
import Button from '../Button';

import './Notifications.sass';

const Notifications = ({ isOpen }) => {
  const { setLoggedUser, loggedUser: { notifications } } = useContext(UserContext);

  const unreadNotificationsIds = notifications
    .reduce((ids, { _id, isRead }) => {
      if (!isRead) ids.push(_id);
      return ids;
    }, []);

  const numOfUnreadNotifications = unreadNotificationsIds.length;

  const markAsReadStateUpdater = (notificationId) => {
    setLoggedUser((draft) => {
      const notificationIndex = notifications
        .findIndex(({ _id }) => _id === notificationId);

      draft.notifications[notificationIndex].isRead = true;
    });
  };

  const deleteNotificationStateUpdater = (notificationId) => {
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
            showDeleteAll={Boolean(notifications.length)}
          />
        </NotificationsHeader>
        {notifications.length > 0 && (
          <NotificationsList>
            {notifications.map(notification => (
              <NotificationItem
                key={notification._id}
                avatar={notification.from.avatar}
                username={notification.from.username}
                isRead={notification.isRead}
              >
                <Mutation
                  mutation={queries.DELETE_NOTIFICATION}
                  variables={{ notificationId: notification._id }}
                  onCompleted={() => deleteNotificationStateUpdater(notification._id)}
                >
                  {deleteNotification => (
                    <Button classes="notifications__delete-btn" onClick={deleteNotification}>
                      <i className="fas fa-times" />
                    </Button>
                  )}
                </Mutation>
                <span className="notifications__body">{notification.body}</span>
                <div className="notifications__footer">
                  <i className="fas fa-fw fa-comment-alt" />
                  <span
                    className="notifications__createdAt"
                  >
                    {moment(+notification.createdAt).startOf('seconds').fromNow()}
                  </span>
                  {!notification.isRead && (
                    <Mutation
                      mutation={queries.READ_NOTIFICATION}
                      variables={{ notificationId: notification._id }}
                      onCompleted={() => markAsReadStateUpdater(notification._id)}
                    >
                      {readNotification => (
                        <Button classes="notifications__bookmark-btn" text="Mark as Read" onClick={readNotification} />
                      )}
                    </Mutation>
                  )}
                </div>
              </NotificationItem>
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
