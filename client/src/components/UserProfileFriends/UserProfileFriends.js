import React from 'react';
import { arrayOf, string } from 'prop-types';
import UserCardsList from '../UserCardsList';

import './UserProfileFriends.sass';

const UserProfileFriends = ({ userIds }) => (
  <div className="user-profile-friends__container">
    <UserCardsList userIds={userIds} />
  </div>
);

UserProfileFriends.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default UserProfileFriends;
