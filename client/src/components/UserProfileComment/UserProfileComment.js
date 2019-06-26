import React from 'react';
import {
  string, shape, arrayOf, number, bool, func,
} from 'prop-types';
import { UserShortSummaryPropTypes } from '../../propTypes';
import Likes from '../Likes';
import ActionsDropDown from '../ActionsDropDown';
import BloggglyLink from '../BloggglyLink';

import './UserProfileComment.sass';

const UserProfileComment = ({
  comment, comment: { post }, isDeleted, addToDeletionQueue,
}) => (
  <li className={`user-profile-comment__container animated zoomIn faster ${isDeleted ? 'deleted' : ''}`}>
    <div className="user-profile-comment__header">
      {'on '}
      <BloggglyLink to={`/user/${post.author.username}`} text={post.author.username} />
      {' post '}
      <BloggglyLink to={`/post/${post._id}`} classes="" text={post.title} />
    </div>
    <p className="user-profile-comment__comment-body">{comment.body}</p>
    <div className="likes__wrapper">
      <Likes
        id={comment._id}
        likesCount={comment.likesCount}
        likes={comment.likes}
      />
      <ActionsDropDown
        onCompletedCb={addToDeletionQueue}
        type="comment"
        resourceId={comment._id}
        postId={comment.post._id}
        isAuthor
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
