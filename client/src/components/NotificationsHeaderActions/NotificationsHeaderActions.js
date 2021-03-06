import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import { arrayOf, string, bool } from 'prop-types';
import { UserContext } from '../../context';
import queries from '../../graphql/queries';
import Button from '../Button';

const NotificationsHeaderActions = ({ unreadNotificationsIds, showDeleteAll }) => {
  const { setLoggedUser } = useContext(UserContext);

  if (!unreadNotificationsIds.length && !showDeleteAll) return null;

  return (
    <>
      {unreadNotificationsIds.length > 0 && (
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
            <Button
              classes="notifications__action-btn"
              onClick={readAllNotifications}
              text="Mark All as Read"
            />
          )}
        </Mutation>
      )}
      {showDeleteAll && (
        <Mutation
          mutation={queries.DELETE_ALL_NOTIFICATIONS}
          onCompleted={() => {
            setLoggedUser((draft) => {
              draft.notifications.length = 0;
            });
          }}
        >
          {deleteAllNotifications => (
            <Button
              classes="notifications__action-btn"
              onClick={deleteAllNotifications}
              text="Delete All"
            />
          )}
        </Mutation>
      )}
    </>
  );
};

NotificationsHeaderActions.propTypes = {
  unreadNotificationsIds: arrayOf(string).isRequired,
  showDeleteAll: bool.isRequired,
};

export default NotificationsHeaderActions;
