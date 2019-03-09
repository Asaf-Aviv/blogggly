import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import { bool, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import { UserContext } from '../../context';

import './FollowButton.sass';

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
          className="btn btn--primary follow-btn"
          type="button"
          onClick={(e) => {
            if (!loggedUser) return;
            follow();
            e.target.innerHTML = e.target.innerHTML === 'Unfollow' ? 'Follow' : 'Unfollow';
          }}
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
