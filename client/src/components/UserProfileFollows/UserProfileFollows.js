import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { arrayOf, string, bool } from 'prop-types';
import UserCardsList from '../UserCardsList';
import { UserContext } from '../../context';

import './UserProfileFollows.sass';

const UserProfileFollows = ({ userIds, followers }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="user-profile__follows">
      <Helmet>
        <title>{`${loggedUser.username}'s ${followers ? 'Followers' : 'Following'} - Blogggly`}</title>
      </Helmet>
      {userIds.length > 0 && (
        <ul className="user-profile__follows-list">
          <UserCardsList userIds={userIds} />
        </ul>
      )}
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
