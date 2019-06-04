import React, { useState, useContext } from 'react';
import { Query } from 'react-apollo';
import queries from '../../graphql/queries';
import Container from '../Container';
import UserSearchBar from '../UserSearchBar';
import UserCard from '../UserCard';
import { UserContext } from '../../context';

import './Users.sass';

const Users = () => {
  const [userQuery, setUserQuery] = useState('');

  const { loggedUser, isLogged } = useContext(UserContext);

  return (
    <div className="users__main">
      <Container>
        <UserSearchBar setUserQuery={setUserQuery} />
        {userQuery && (
          <Query
            query={queries.SEARCH_USERS}
            variables={{ userQuery }}
          >
            {({ loading, data: { users } = {} }) => {
              if (loading) return null;

              if (!users.length) {
                return <h3 className="users__not-found">No users found.</h3>;
              }

              return (
                <ul className="users__list">
                  {users.map(user => (
                    <li key={user._id}>
                      <UserCard
                        user={user}
                        isIncomingFriendRequest={isLogged
                          && loggedUser.incomingFriendRequests.includes(user._id)
                        }
                        friendRequestPending={isLogged && (
                          loggedUser.incomingFriendRequests.includes(user._id)
                          || loggedUser.sentFriendRequests.includes(user._id)
                        )}
                        isAFriend={isLogged && loggedUser.friends.includes(user._id)}
                        following={isLogged && loggedUser.following.includes(user._id)}
                      />
                    </li>
                  ))}
                </ul>
              );
            }}
          </Query>
        )}
      </Container>
    </div>
  );
};

export default Users;
