import React, { useContext } from 'react';
import { arrayOf, string } from 'prop-types';
import { Helmet } from 'react-helmet';
import UserCardsList from '../UserCardsList';
import { UserContext } from '../../context';

import './UserProfileFriends.sass';

const UserProfileFriends = ({ userIds }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="user-profile__friends">
      <Helmet>
        <title>{`${loggedUser.username}'s Friends - Blogggly`}</title>
      </Helmet>
      {userIds.length > 0 && (
        <ul className="user-profile__friends-list">
          <UserCardsList userIds={userIds} />
        </ul>
      )}
    </div>
  );
};

UserProfileFriends.propTypes = {
  userIds: arrayOf(string).isRequired,
};

export default UserProfileFriends;
