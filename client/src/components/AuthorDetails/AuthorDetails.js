import React from 'react';
import './AuthorDetails.sass';
import {
  string, oneOfType, node, arrayOf,
} from 'prop-types';

const AuthorDetails = ({ avatar, username, children }) => (
  <div className="author">
    <img
      className="author__avatar"
      src={avatar}
      alt={username}
    />
    <span className="author__username">{username}</span>
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
