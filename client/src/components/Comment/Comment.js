import React from 'react';
import { string, bool } from 'prop-types';
import AuthorDetails from '../AuthorDetails';
import Likes from '../Likes/Likes';
import { CommentPropTypes } from '../../propTypes';
import ActionsDropDown from '../ActionsDropDown';
import DisplayDate from '../DisplayDate';

import './Comment.sass';

const Comment = ({ comment, postId, isAuthor }) => (
  <li className="comment">
    <div className="comment__header">
      <AuthorDetails {...comment.author}>
        <DisplayDate date={comment.createdAt} />
      </AuthorDetails>
    </div>
    <div className="comment__content">
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
    </div>
  </li>
);

Comment.propTypes = {
  postId: string.isRequired,
  comment: CommentPropTypes.isRequired,
  isAuthor: bool.isRequired,
};

export default Comment;
