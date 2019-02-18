import React from 'react';
import { Query } from 'react-apollo';
import queries from '../../graphql/queries';
import Container from '../Container';

const Users = () => (
  <div className="users">
    <Container>
      <Query query={queries.ALL_USERS}>
        {({ loading, error, data }) => {
          if (loading) return <h1>loading</h1>;
          if (error) return <h1>Error</h1>;

          return (
            <div className="users">
              {data.users.map(({ username, avatar }) => (
                <div key={username}>
                  <h1>{username}</h1>
                  <img height="60" src={avatar} alt={username} />
                </div>
              ))}
            </div>
          );
        }}
      </Query>
    </Container>
  </div>
);

export default Users;
