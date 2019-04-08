import React from 'react';
import { Query } from 'react-apollo';
import { Redirect } from 'react-router-dom';
import { shape, string } from 'prop-types';
import queries from '../../graphql/queries';

const UserProfile = ({ match: { params: { username } } }) => (
  <Query
    query={queries.GET_USER_BY_USERNAME}
    variables={{ username }}
  >
    {({ loading, error, data: { user } }) => {
      if (loading) return null;
      if (error) return <Redirect to="/" />;

      return (
        <div>
          <h1>{user.username}</h1>
        </div>
      );
    }}
  </Query>
);

UserProfile.propTypes = {
  match: shape({
    params: shape({
      username: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default UserProfile;
