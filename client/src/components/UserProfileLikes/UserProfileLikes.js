import React, { useState } from 'react';
import { Query } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
  arrayOf, string, shape, number, bool, func,
} from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';
import Likes from '../Likes';

import './UserProfileLikes.sass';
import Button from '../Button';

const UserProfilePostLike = ({ post }) => (
  <div className="user-likes__item">
    <Link className="user-likes__link" to={`/post/${post._id}`}>
      <span>{post.title}</span>
    </Link>
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
    <Link className="user-likes__link" to={`/post/${comment.post._id}`}>
      <span>{comment.post.title}</span>
    </Link>
    <p>{comment.body}</p>
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

const UserProfileLikesTab = ({ changeTab, text, active }) => (
  <Button
    classes={`user-likes__tab ${active ? 'user-likes__tab--active' : ''}`}
    onClick={changeTab}
    text={text}
  />
);

UserProfileLikesTab.propTypes = {
  changeTab: func.isRequired,
  text: string.isRequired,
  active: bool.isRequired,
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
              <UserProfileLikesTab
                text="Posts"
                changeTab={() => setShowCategory('posts')}
                active={showCategory === 'posts'}
              />
              <UserProfileLikesTab
                text="Comments"
                changeTab={() => setShowCategory('comments')}
                active={showCategory === 'comments'}
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
