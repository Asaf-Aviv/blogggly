import React from 'react';
import { func } from 'prop-types';
import { SearchPostPropTypes } from '../../propTypes';
import UserAvatar from '../UserAvatar';
import BloggglyLink from '../BloggglyLink';

import './NavSearchItem.sass';

const NavSearchItem = ({ post, hideResults }) => (
  <li className="nav-search-results__item">
    <UserAvatar
      avatar={post.author.avatar}
      username={post.author.username}
      width={40}
    />
    <BloggglyLink
      to={`/user/${post.author.username}`}
      onClick={hideResults}
      text={post.author.username}
    />
    <BloggglyLink to={`/post/${post._id}`} onClick={hideResults} text={post.title} />
  </li>
);

NavSearchItem.propTypes = {
  post: SearchPostPropTypes.isRequired,
  hideResults: func.isRequired,
};

export default NavSearchItem;
