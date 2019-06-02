import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { func, bool } from 'prop-types';
import { UserContext } from '../../context';
import UserAvatar from '../UserAvatar';
import Badge from '../Badge';
import NotificationsContainer from '../NotificationsContainer';
import Button from '../Button';
import NotificationsList from '../NotificationsList';
import FriendRequestActions from '../FriendRequestActions';
import queries from '../../graphql/queries';
import utils from '../../utils';
import FriendRequestHeaderActions from '../FriendRequestHeaderActions';
import NotificationsHeader from '../NotificationHeader';

import './FriendRequestNotifications.sass';

const FriendRequestNotifications = ({ isOpen, isOpenToggler }) => {
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
                <NotificationsList>
                  {users.map(user => (
                    <li key={user._id} className="friend-request">
                      <div className="friend-request__user-details">
                        <UserAvatar avatar={user.avatar} username={user.username} width={30} />
                        <Link
                          onClick={isOpenToggler}
                          className="friend-request__link"
                          to={`/user/${user.username}`}
                        >
                          {user.username}
                        </Link>
                      </div>
                      <FriendRequestActions
                        incoming
                        userId={user._id}
                        username={user.username}
                        render={(declineFriendRequest, accpetFriendRequest) => (
                          <div>
                            <Button classes="btn btn--sm btn--default" text="Decline" onClick={declineFriendRequest} />
                            <Button classes="btn btn--sm btn--success" text="Accpet" onClick={accpetFriendRequest} />
                          </div>
                        )}
                      />
                    </li>
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
  isOpenToggler: func,
};

// define default props to avoid cloneElement proptypes
// error because elements are checked at the creation time
FriendRequestNotifications.defaultProps = {
  isOpen: false,
  isOpenToggler: () => {},
};

export default FriendRequestNotifications;
