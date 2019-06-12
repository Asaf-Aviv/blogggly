import React, { useContext } from 'react';
import {
  arrayOf, shape, string, number,
} from 'prop-types';
import ShowcaseCard from '../ShowcaseCard';
import { UserContext } from '../../context';
import { UserShortSummaryPropTypes } from '../../propTypes';

const PostList = ({ posts }) => {
  const { isLogged, loggedUser } = useContext(UserContext);

  return (
    <div className="posts__container">
      {posts.map(post => (
        <ShowcaseCard
          key={post._id}
          post={post}
          isAuthor={isLogged && loggedUser._id === post.author._id}
        />
      ))}
    </div>
  );
};

PostList.propTypes = {
  posts: arrayOf(shape({
    _id: string.isRequired,
    title: string.isRequired,
    commentsCount: number.isRequired,
    likesCount: number.isRequired,
    author: UserShortSummaryPropTypes,
    createdAt: string.isRequired,
    tags: arrayOf(string),
  })).isRequired,
};

export default PostList;
