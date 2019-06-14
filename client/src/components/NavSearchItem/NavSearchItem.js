import React from 'react';
import { func } from 'prop-types';
import { Link } from 'react-router-dom';
import { SearchPostPropTypes } from '../../propTypes';
import UserAvatar from '../UserAvatar';

import './NavSearchItem.sass';

const NavSearchItem = ({ post, hideResults }) => (
  <li>
    <Link to={`/post/${post._id}`} onClick={hideResults}>
      <div className="nav-search-results__inner-item">
        <UserAvatar
          avatar={post.author.avatar}
          username={post.author.username}
          width={40}
        />
        {'by '}
        <span className="nav-search-results__author">{post.author.username}</span>
        <span className="nav-search-results__title">{post.title}</span>
      </div>
    </Link>
  </li>
);

NavSearchItem.propTypes = {
  post: SearchPostPropTypes.isRequired,
  hideResults: func.isRequired,
};

export default NavSearchItem;
