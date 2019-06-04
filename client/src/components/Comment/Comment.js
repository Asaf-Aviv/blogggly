import React from 'react';
import { string, bool } from 'prop-types';
import moment from 'moment';
import AuthorDetails from '../AuthorDetails';
import Likes from '../Likes/Likes';
import { CommentPropTypes } from '../../propTypes';
import ActionsDropDown from '../ActionsDropDown';

import './Comment.sass';

const Comment = ({ comment, postId, isAuthor }) => (
  <li className="comment">
    <AuthorDetails {...comment.author}>
      <span className="comment__date">{moment(+comment.createdAt).startOf('seconds').fromNow()}</span>
    </AuthorDetails>
    <p className="comment__body">{comment.body}</p>
    <Likes
      id={comment._id}
      likesCount={comment.likesCount}
      likes={comment.likes}
      postId={postId}
    />
    <ActionsDropDown
      type="comment"
      resourceId={comment._id}
      isAuthor={isAuthor}
      postId={postId}
    />
  </li>
);

Comment.propTypes = {
  postId: string.isRequired,
  comment: CommentPropTypes.isRequired,
  isAuthor: bool.isRequired,
};

export default Comment;
