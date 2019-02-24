import React from 'react';
import { shape, string } from 'prop-types';
import moment from 'moment';
import AuthorDetails from '../AuthorDetails';

import './Comment.sass';

const Comment = ({ comment }) => (
  <li className="comment">
    <AuthorDetails {...comment.author}>
      <span className="comment__date">{moment(+comment.createdAt).startOf('seconds').fromNow()}</span>
    </AuthorDetails>
    <p className="comment__body">{comment.body}</p>
  </li>
);

Comment.propTypes = {
  comment: shape({
    _id: string.isRequired,
    body: string.isRequired,
    createdAt: string.isRequired,
    updatedAt: string.isRequired,
    author: shape({
      _id: string.isRequired,
      username: string.isRequired,
      avatar: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Comment;
