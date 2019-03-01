import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import { bool, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import { UserContext } from '../../context';

const FollowButton = ({ following, authorId }) => {
  const { loggedUser, setLoggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.TOGGLE_FOLLOW}
      errorPolicy="all"
      variables={{ userIdToFollow: authorId }}
      onError={utils.UIErrorNotifier}
      onCompleted={({ toggleFollow }) => setLoggedUser({ ...loggedUser, ...toggleFollow })}
    >
      {follow => (
        <button
          type="button"
          onClick={follow}
        >
          {following ? 'Unfollow' : 'Follow'}
        </button>
      )}
    </Mutation>
  );
};
FollowButton.propTypes = {
  following: bool.isRequired,
  authorId: string.isRequired,
};

export default FollowButton;
