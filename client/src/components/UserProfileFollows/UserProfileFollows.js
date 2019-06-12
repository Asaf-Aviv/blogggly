import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { arrayOf, string, bool } from 'prop-types';
import UserCardsList from '../UserCardsList';
import { UserContext } from '../../context';

import './UserProfileFollows.sass';

const UserProfileFollows = ({ userIds, followers }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="user-profile-follows__container">
      <Helmet>
        <title>{`${loggedUser.username}'s ${followers ? 'Followers' : 'Following'} - Blogggly`}</title>
      </Helmet>
      <UserCardsList userIds={userIds} />
    </div>
  );
};

UserProfileFollows.propTypes = {
  userIds: arrayOf(string).isRequired,
  followers: bool,
};

UserProfileFollows.defaultProps = {
  followers: false,
};

export default UserProfileFollows;
