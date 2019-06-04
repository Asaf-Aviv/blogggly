import React, { useContext } from 'react';
import { Query } from 'react-apollo';
import { bool } from 'prop-types';
import { UserContext } from '../../context';
import Badge from '../Badge';
import NotificationsContainer from '../NotificationsContainer';
import Button from '../Button';
import NotificationsList from '../NotificationsList';
import FriendRequestActions from '../FriendRequestActions';
import queries from '../../graphql/queries';
import utils from '../../utils';
import FriendRequestHeaderActions from '../FriendRequestHeaderActions';
import NotificationsHeader from '../NotificationHeader';
import NotificationItem from '../NotificationItem';

import './FriendRequestNotifications.sass';

const FriendRequestNotifications = ({ isOpen }) => {
  const { loggedUser: { incomingFriendRequests } } = useContext(UserContext);
  const numOfNotifications = incomingFriendRequests.length;

  if (!isOpen) return <Badge num={numOfNotifications} />;

  return (
    <>
      <Badge num={numOfNotifications} />
      <NotificationsContainer>
        <NotificationsHeader title="Friend Requests">
          <FriendRequestHeaderActions userIds={incomingFriendRequests} />
        </NotificationsHeader>
        {numOfNotifications > 0 && (
          <Query
            query={queries.GET_SHORT_USERS_SUMMARY_BY_IDS}
            variables={{ userIds: incomingFriendRequests }}
            onError={utils.UIErrorNotifierm}
          >
            {({ loading, data: { users } }) => {
              if (loading) return null;

              return (
                <NotificationsList classes="friend-requests__notifications">
                  {users.map(({ _id, avatar, username }) => (
                    <NotificationItem key={_id} avatar={avatar} username={username}>
                      <FriendRequestActions
                        incoming
                        userId={_id}
                        username={username}
                        render={(declineFriendRequest, accpetFriendRequest) => (
                          <div className="friend-request__action-btns">
                            <Button classes="btn btn--sm btn--default" text="Decline" onClick={declineFriendRequest} />
                            <Button classes="btn btn--sm btn--success" text="Accpet" onClick={accpetFriendRequest} />
                          </div>
                        )}
                      />
                    </NotificationItem>
                  ))}
                </NotificationsList>
              );
            }}
          </Query>
        )}
      </NotificationsContainer>
    </>
  );
};

FriendRequestNotifications.propTypes = {
  isOpen: bool,
};

// define default props to avoid cloneElement proptypes
// error because elements are checked at the creation time
FriendRequestNotifications.defaultProps = {
  isOpen: false,
};

export default FriendRequestNotifications;
