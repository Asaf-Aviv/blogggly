import React, { useContext, useRef } from 'react';
import { Mutation } from 'react-apollo';
import { bool, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import { UserContext } from '../../context';

import './FollowButton.sass';

const FollowButton = ({ following, userId }) => {
  const { loggedUser, setLoggedUser } = useContext(UserContext);
  const followButtonRef = useRef(null);

  const changeFollowText = () => {
    const followButtonText = followButtonRef.current.innerHTML;
    followButtonRef.current.innerHTML = followButtonText === 'Unfollow'
      ? 'Follow' : 'Unfollow';
  };

  return (
    <Mutation
      mutation={queries.TOGGLE_FOLLOW}
      errorPolicy="all"
      variables={{ userId }}
      onError={(err) => {
        utils.UIErrorNotifier(err);
        changeFollowText();
      }}
      onCompleted={({ toggleFollow }) => setLoggedUser({ ...loggedUser, ...toggleFollow })}
    >
      {follow => (
        <button
          ref={followButtonRef}
          className="btn btn--primary btn--sm follow-btn"
          type="button"
          onClick={() => {
            if (!loggedUser) return;
            follow();
            changeFollowText();
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
  userId: string.isRequired,
};

export default FollowButton;
