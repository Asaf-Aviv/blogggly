import React from 'react';
import { Query } from 'react-apollo';
import { arrayOf, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';

const UserProfileFollows = ({ userIds }) => (
  <Query
    query={queries.GET_USERS_BY_IDS}
    onError={utils.UIErrorNotifier}
    variables={{ userIds }}
  >
    {({ data: { users }, loading }) => {
      if (loading) return <h1>loading</h1>;

      return users.map(user => (
        <h1 key={user._id}>{user._id}</h1>
      ));
    }}
  </Query>
);

UserProfileFollows.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default UserProfileFollows;
