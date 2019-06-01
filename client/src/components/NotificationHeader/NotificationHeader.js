import React, { useContext } from 'react';
import { string, arrayOf, bool } from 'prop-types';
import { Mutation } from 'react-apollo';
import queries from '../../graphql/queries';
import { UserContext } from '../../context';

import './NotificationsHeader.sass';

const NotificationsHeader = ({ unreadNotificationsIds, disableDeleteAll }) => {
  const { setLoggedUser } = useContext(UserContext);
  return (
    <div className="notifications__header">
      <h5>Notifications</h5>
      <div className="notifications__actions">
        <Mutation
          mutation={queries.READ_ALL_NOTIFICATIONS}
          variables={{ unreadNotificationsIds }}
          onCompleted={() => {
            setLoggedUser((draft) => {
              draft.notifications.forEach((notification) => {
                notification.isRead = true;
              });
            });
          }}
        >
          {readAllNotifications => (
            <button
              className="notifications__action-btn"
              onClick={readAllNotifications}
              disabled={!unreadNotificationsIds.length}
            >
              Mark All as Read
            </button>
          )}
        </Mutation>
        <Mutation
          mutation={queries.DELETE_ALL_NOTIFICATIONS}
          onCompleted={() => {
            setLoggedUser((draft) => {
              draft.notifications.length = 0;
            });
          }}
        >
          {deleteAllNotifications => (
            <button
              className="notifications__action-btn"
              onClick={deleteAllNotifications}
              disabled={disableDeleteAll}
            >
              Delete All
            </button>
          )}
        </Mutation>
      </div>
    </div>
  );
};

NotificationsHeader.propTypes = {
  unreadNotificationsIds: arrayOf(string).isRequired,
  disableDeleteAll: bool.isRequired,
};

export default NotificationsHeader;
