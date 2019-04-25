import React, { useState, useEffect, useContext } from 'react';
import { Query } from 'react-apollo';
import queries from '../../graphql/queries';
import Container from '../Container';
import UserSearchBar from '../UserSearchBar';
import UserCard from '../UserCard';

import './Users.sass';
import { UserContext } from '../../context';

const Users = () => {
  const [userQuery, setUserQuery] = useState('');

  const { loggedUser, isLogged } = useContext(UserContext);

  useEffect(() => {
    console.log('setting query', userQuery);
  }, [userQuery]);

  return (
    <main className="users__main">
      <Container>
        <UserSearchBar setUserQuery={setUserQuery} />
        {userQuery && (
          <Query
            query={queries.SEARCH_USERS}
            variables={{ userQuery }}
          >
            {({ loading, error, data: { users } = {} }) => {
              if (loading) return <h1>loading</h1>;
              if (error) return <h1>Error</h1>;

              if (!users.length) {
                return <h3 className="users__not-found">No users found.</h3>;
              }

              return (
                <ul className="users__list">
                  {users.map(user => (
                    <li key={user._id}>
                      <UserCard
                        user={user}
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
    </main>
  );
};

export default Users;
