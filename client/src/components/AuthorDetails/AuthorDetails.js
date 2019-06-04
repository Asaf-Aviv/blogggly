import React from 'react';
import {
  string, oneOfType, node, arrayOf,
} from 'prop-types';
import UserAvatar from '../UserAvatar';

import './AuthorDetails.sass';
import BloggglyLink from '../BloggglyLink';

const AuthorDetails = ({ avatar, username, children }) => (
  <div className="author">
    <UserAvatar
      width={50}
      avatar={avatar}
      username={username}
    />
    <BloggglyLink to={`/user/${username}`} text={username} />
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
