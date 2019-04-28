import React, {
  useEffect, useRef, useContext, useState,
} from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { UserContext } from '../../context';
import UserAvatar from '../UserAvatar';
import FriendRequestActions from '../FriendRequestActions';
import queries from '../../graphql/queries';

import './FriendRequestNotifications.sass';
import Emoji from '../Emoji';

const EmptyNotification = () => (
  <h6 className="notifications__empty">
    Everything is clear captain
    {' '}
    <Emoji emoji="👌" label="OK hand" />
  </h6>
);

const FriendRequestNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { loggedUser } = useContext(UserContext);

  const notificationBoxRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isOpen]);

  const handleOutsideClick = (e) => {
    console.log('click');
    const where = notificationBoxRef.current.contains(e.target) ? 'inside' : 'outside';
    console.log(notificationBoxRef.current.contains(e.target));
    console.log(`${e.target} is ${where}`);
    if (notificationBoxRef.current.contains(e.target)) return;
    setIsOpen(false);
  };

  const isOpenToggler = () => setIsOpen(!isOpen);

  return (
    <div
      ref={notificationBoxRef}
      className="friend-request-notifications"
      onClick={isOpenToggler}
    >
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
                                <button
                                  className="btn btn--sm btn--default"
                                  type="button"
                                  onClick={declineFriendRequest}
                                >
                                Decline
                                </button>
                                <button
                                  className="btn btn--sm btn--success"
                                  type="button"
                                  onClick={accpetFriendRequest}
                                >
                                Accpet
                                </button>
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
            : <EmptyNotification />}
        </div>
      )}
    </div>
  );
};


export default FriendRequestNotifications;
