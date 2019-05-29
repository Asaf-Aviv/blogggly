import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { func, bool } from 'prop-types';
import { UserContext } from '../../context';
import UserAvatar from '../UserAvatar';
import EmptySentence from '../EmptySentence';
import Button from '../Button';
import FriendRequestActions from '../FriendRequestActions';
import queries from '../../graphql/queries';

import './FriendRequestNotifications.sass';

const FriendRequestNotifications = ({ isOpen, isOpenToggler }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <>
      <i className="fas fa-user-plus" />
      {loggedUser.incomingFriendRequests.length > 0 && (
        <span className="notifications__badge">{loggedUser.incomingFriendRequests.length}</span>
      )}
      {isOpen && (
        <div className="notifications" onClick={e => e.stopPropagation()}>
          {loggedUser.incomingFriendRequests.length > 0
            ? (
              <Query
                query={queries.GET_SHORT_USERS_SUMMARY_BY_IDS}
                variables={{ userIds: loggedUser.incomingFriendRequests, shortSummary: true }}
              >
                {({ loading, data: { users } }) => {
                  if (loading) return null;

                  return (
                    <ul className="notifications__list">
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
                    </ul>
                  );
                }}
              </Query>
            )
            : <EmptySentence />}
        </div>
      )}
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
