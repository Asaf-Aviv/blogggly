import React from 'react';
import { arrayOf, string } from 'prop-types';
import UserCardsList from '../UserCardsList';

import './UserProfileFollows.sass';

const UserProfileFollows = ({ userIds }) => (
  <div className="user-profile-follows__container">
    <UserCardsList userIds={userIds} />
  </div>
);

UserProfileFollows.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default UserProfileFollows;
