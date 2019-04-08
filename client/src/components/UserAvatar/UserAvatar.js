import React from 'react';
import { string, number } from 'prop-types';

import './UserAvatar.sass';

const UserAvatar = ({
  avatar, username, classes, width,
}) => (
  <div className="avatar__container">
    <figure className="avatar__figure">
      <img className={`avatar ${classes}`} width={width} src={avatar} alt={username} />
    </figure>
  </div>
);

UserAvatar.propTypes = {
  avatar: string.isRequired,
  username: string.isRequired,
  width: number,
  classes: string,
};

UserAvatar.defaultProps = {
  classes: '',
  width: 80,
};

export default UserAvatar;
