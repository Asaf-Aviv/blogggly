import React, { useContext } from 'react';
import { arrayOf, string } from 'prop-types';
import { Helmet } from 'react-helmet';
import UserCardsList from '../UserCardsList';
import { UserContext } from '../../context';

import './UserProfileFriends.sass';

const UserProfileFriends = ({ userIds }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="user-profile-friends__container">
      <Helmet>
        <title>{`${loggedUser.username}'s Friends - Blogggly`}</title>
      </Helmet>
      <UserCardsList userIds={userIds} />
    </div>
  );
};

UserProfileFriends.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default UserProfileFriends;
