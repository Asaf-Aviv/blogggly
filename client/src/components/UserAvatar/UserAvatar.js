import React from 'react';
import { string } from 'prop-types';

import './UserAvatar.sass';

const UserAvatar = ({ avatar, username }) => (
  <figure className="avatar__container">
    <img className="avatar" src={avatar} alt={username} />
  </figure>
);

UserAvatar.propTypes = {
  avatar: string.isRequired,
  username: string.isRequired,
};

export default UserAvatar;
