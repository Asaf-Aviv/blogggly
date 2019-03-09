import React from 'react';
import { string, number } from 'prop-types';

import './UserAvatar.sass';

const UserAvatar = ({
  avatar, username, classes, width,
}) => (
  <figure className="avatar__container">
    <img className={`avatar ${classes}`} width={width} src={avatar} alt={username} />
  </figure>
);

UserAvatar.propTypes = {
  avatar: string.isRequired,
  username: string.isRequired,
  width: number.isRequired,
  classes: string,
};

UserAvatar.defaultProps = {
  classes: '',
};

export default UserAvatar;
