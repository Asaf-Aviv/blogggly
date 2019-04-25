import React from 'react';
import { string, arrayOf } from 'prop-types';
import Comment from '../Comment';
import AddComment from '../AddComment';
import { CommentPropTypes } from '../../propTypes';

import './Comments.sass';

const Comments = ({ comments, postId }) => (
  <section className="comments">
    <header className="comments__header">
      <h2>Comments</h2>
    </header>
    <AddComment postId={postId} />
    <ul className="comments__list">
      {comments.map(comment => (
        <Comment key={comment._id} comment={comment} postId={postId} />
      ))}
    </ul>
  </section>
);

Comments.propTypes = {
  postId: string.isRequired,
  comments: arrayOf(CommentPropTypes).isRequired,
};

export default Comments;
