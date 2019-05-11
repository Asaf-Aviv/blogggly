import React from 'react';
import { Link } from 'react-router-dom';
import {
  string, shape, arrayOf, number, bool, func,
} from 'prop-types';
import { UserShortSummaryPropTypes } from '../../propTypes';
import Likes from '../Likes';
import DeleteCommentButton from '../DeleteCommentButton';

import './UserProfileComment.sass';

const UserProfileComment = ({
  comment, comment: { post }, isDeleted, addToDeletionQueue,
}) => (
  <li className={`user-profile-comment__container ${isDeleted ? 'deleted' : ''}`}>
    <Link to={`/post/${post._id}`}>
      <h4 className="user-profile-comment__post-title">
        {`on ${post.author.username} post ${post.title}`}
      </h4>
    </Link>
    <p className="user-profile-comment__comment-body">{comment.body}</p>
    <div className="likes__wrapper">
      <Likes
        id={comment._id}
        likesCount={comment.likesCount}
        likes={comment.likes}
      />
      <DeleteCommentButton
        commentId={comment._id}
        postId={post._id}
        onCompletedCb={addToDeletionQueue}
      />
    </div>
  </li>
);

UserProfileComment.propTypes = {
  comment: shape({
    _id: string.isRequired,
    body: string.isRequired,
    createdAt: string.isRequired,
    likes: arrayOf(string).isRequired,
    likesCount: number.isRequired,
    post: shape({
      _id: string.isRequired,
      title: string.isRequired,
      author: UserShortSummaryPropTypes.isRequired,
    }).isRequired,
  }).isRequired,
  isDeleted: bool.isRequired,
  addToDeletionQueue: func.isRequired,
};

export default UserProfileComment;
