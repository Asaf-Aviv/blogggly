import React, { useContext, useRef } from 'react';
import { Mutation } from 'react-apollo';
import Alert from 'react-s-alert';
import { bool, string } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import { UserContext, MemberFormsContext } from '../../context';

import './FollowButton.sass';

const FollowButton = ({ following, userId, username }) => {
  const { loggedUser, setLoggedUser, isLogged } = useContext(UserContext);
  const { setShowLogin, setShowMemberForms } = useContext(MemberFormsContext);

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
      onCompleted={({ toggleFollow }) => {
        setLoggedUser({ ...loggedUser, ...toggleFollow });
      }}
    >
      {follow => (
        <button
          ref={followButtonRef}
          className="btn btn--primary btn--sm follow-btn"
          type="button"
          onClick={() => {
            if (!isLogged) {
              Alert.info(`Please login or signup to follow ${username}.`);
              setShowLogin(true);
              setShowMemberForms(true);
              return;
            }
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
  username: string.isRequired,
};

export default FollowButton;
