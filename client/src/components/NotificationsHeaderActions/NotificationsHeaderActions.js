import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import { arrayOf, string, bool } from 'prop-types';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';

const NotificationsHeaderActions = ({ unreadNotificationsIds, disableDeleteAll }) => {
  const { setLoggedUser } = useContext(UserContext);

  return (
    <>
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
    </>
  );
};

NotificationsHeaderActions.propTypes = {
  unreadNotificationsIds: arrayOf(string).isRequired,
  disableDeleteAll: bool.isRequired,
};

export default NotificationsHeaderActions;
