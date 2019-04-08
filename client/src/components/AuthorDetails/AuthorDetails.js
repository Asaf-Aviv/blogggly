import React from 'react';
import { Link } from 'react-router-dom';
import {
  string, oneOfType, node, arrayOf,
} from 'prop-types';
import UserAvatar from '../UserAvatar';

import './AuthorDetails.sass';

const AuthorDetails = ({ avatar, username, children }) => (
  <div className="author">
    <UserAvatar
      width={50}
      avatar={avatar}
      username={username}
    />
    <Link to={`/user/${username}`} className="author__username-link">
      {username}
    </Link>
    {children}
  </div>
);

AuthorDetails.propTypes = {
  avatar: string.isRequired,
  username: string.isRequired,
  children: oneOfType([
    node,
    arrayOf(node),
  ]),
};

AuthorDetails.defaultProps = {
  children: null,
};

export default AuthorDetails;
