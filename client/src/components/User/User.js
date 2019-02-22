import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { shape, string } from 'prop-types';

import './User.sass';

const SEARCH_USER = gql`
  query searchUser($username: String) {
    searchUser(username: $username) {
      user {
        _id
        username
        email
      }
    }
  }
`;

const User = ({ match: { params: { username } } }) => (
  <Query
    query={SEARCH_USER}
    variables={{ username }}
  >
    {({ loading, error, data }) => {
      if (loading) return <h1>lading</h1>;
      if (error) return <h1>error</h1>;

      if (!data.searchUser.user) return <h1>user not found</h1>;

      return (
        <div>
          <h1>{data.searchUser.user._id}</h1>
          <p>{data.searchUser.user.email}</p>
          <p>{data.searchUser.user.username}</p>
        </div>
      );
    }}
  </Query>
);

User.propTypes = {
  match: shape({
    params: shape({
      username: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default User;
