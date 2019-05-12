import React from 'react';
import { func } from 'prop-types';
import { Link } from 'react-router-dom';
import { SearchPostPropTypes } from '../../propTypes';
import UserAvatar from '../UserAvatar';

const NavSearchItem = ({ post, hideResults }) => (
  <li className="nav-search-results__item">
    <UserAvatar
      avatar={post.author.avatar}
      username={post.author.username}
      width={40}
    />
    <h4 className="nav-search-results__author">{`by ${post.author.username}`}</h4>
    <Link to={`/post/${post._id}`} onClick={hideResults}>
      <h4>{post.title}</h4>
    </Link>
  </li>
);

NavSearchItem.propTypes = {
  post: SearchPostPropTypes.isRequired,
  hideResults: func.isRequired,
};

export default NavSearchItem;
