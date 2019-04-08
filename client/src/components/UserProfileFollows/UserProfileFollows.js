import React from 'react';
import { Query } from 'react-apollo';
import { arrayOf, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import UserSummaryCard from '../UserSummaryCard';

import './UserProfileFollows.sass';

const UserProfileFollows = ({ userIds }) => (
  <Query
    query={queries.GET_USERS_BY_IDS}
    onError={utils.UIErrorNotifier}
    variables={{ userIds }}
  >
    {({ data: { users }, loading }) => {
      if (loading) return null;

      return (
        <div className="user-profile-follows__container">
          {users.map(user => (
            <UserSummaryCard key={user._id} user={user} />
          ))}
        </div>
      );
    }}
  </Query>
);

UserProfileFollows.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default UserProfileFollows;
