import React, { useContext } from 'react';
import { arrayOf, string } from 'prop-types';
import { Query } from 'react-apollo';
import queries from '../../graphql/queries';
import utils from '../../utils';
import UserCard from '../UserCard';
import { UserContext } from '../../context';

const UserCardsList = ({ userIds }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <Query
      query={queries.GET_USERS_BY_IDS}
      onError={utils.UIErrorNotifier}
      variables={{ userIds }}
    >
      {({ loading, data: { users } }) => {
        if (loading) return null;

        return users.map(user => (
          user
            ? (
              <UserCard
                key={user._id}
                user={user}
                following={loggedUser.following.includes(user._id)}
                isIncomingFriendRequest={loggedUser.incomingFriendRequests.includes(user._id)}
                friendRequestPending={
                loggedUser.incomingFriendRequests.includes(user._id)
                || loggedUser.sentFriendRequests.includes(user._id)
              }
                isAFriend={loggedUser.friends.includes(user._id)}
              />
            )
            : null
        ));
      }}
    </Query>
  );
};

UserCardsList.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default UserCardsList;
