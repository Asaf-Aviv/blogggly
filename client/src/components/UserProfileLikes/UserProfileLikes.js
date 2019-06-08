import React, { useState } from 'react';
import { Query } from 'react-apollo';
import {
  arrayOf, string, shape, number,
} from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import Button from '../Button';
import Likes from '../Likes';
import BloggglyLink from '../BloggglyLink';

import './UserProfileLikes.sass';

const UserProfilePostLike = ({ post }) => (
  <div className="user-likes__item">
    <div className="user-likes__header">
      <span>on </span>
      <BloggglyLink to={`/user/${post.author.username}`} text={post.author.username} />
      {' post '}
      <BloggglyLink to={`/post/${post._id}`} text={post.title} />
    </div>
    <Likes
      likesCount={post.likesCount}
      id={post._id}
      likes={post.likes}
      isPost
    />
  </div>
);

UserProfilePostLike.propTypes = {
  post: shape({
    _id: string.isRequired,
    title: string.isRequired,
    likesCount: number.isRequired,
    likes: arrayOf(string).isRequired,
  }).isRequired,
};

const UserProfileCommentLike = ({ comment }) => (
  <div className="user-likes__item">
    <div className="user-likes__header">
      <span>on </span>
      <BloggglyLink to={`/user/${comment.post.author.username}`} text={comment.post.author.username} />
      {' post '}
      <BloggglyLink to={`/post/${comment.post._id}`} text={comment.post.title} />
    </div>
    <p className="user-likes__body">{comment.body}</p>
    <Likes
      likesCount={comment.likesCount}
      id={comment._id}
      likes={comment.likes}
    />
  </div>
);

UserProfileCommentLike.propTypes = {
  comment: shape({
    _id: string.isRequired,
    body: string.isRequired,
    likesCount: number.isRequired,
    likes: arrayOf(string).isRequired,
    post: shape({
      _id: string.isRequired,
      title: string.isRequired,
      author: shape({
        _id: string.isRequired,
        avatar: string.isRequired,
        username: string.isRequired,
      }),
    }).isRequired,
  }).isRequired,
};

const UserProfileLikes = ({ likes }) => {
  const [showCategory, setShowCategory] = useState('posts');

  return (
    <Query
      query={queries.GET_USER_LIKES}
      variables={{ postIds: likes.posts, commentIds: likes.comments }}
      onError={utils.UIErrorNotifier}
    >
      {({ data: { posts, comments }, loading }) => {
        if (loading) return null;

        return (
          <div className="user-likes">
            <div className="user-likes__tabs-container">
              <Button
                classes={`user-likes__tab ${showCategory === 'posts' ? 'user-likes__tab--active' : ''}`}
                onClick={() => setShowCategory('posts')}
                text="Posts"
              />
              <Button
                classes={`user-likes__tab ${showCategory === 'comments' ? 'user-likes__tab--active' : ''}`}
                onClick={() => setShowCategory('comments')}
                text="Comments"
              />
            </div>
            {showCategory === 'posts'
              ? posts.map(post => (
                post
                  ? <UserProfilePostLike key={post._id} post={post} />
                  : null
              ))
              : comments.map(comment => (
                comment
                  ? <UserProfileCommentLike key={comment._id} comment={comment} />
                  : null
              ))
          }
          </div>
        );
      }}
    </Query>
  );
};

UserProfileLikes.propTypes = {
  likes: shape({
    posts: arrayOf(string).isRequired,
    comments: arrayOf(string).isRequired,
  }).isRequired,
};

export default UserProfileLikes;
