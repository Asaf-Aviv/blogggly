import React from 'react';
import { Link } from 'react-router-dom';
import {
  shape, number, string, arrayOf, bool,
} from 'prop-types';
import Tags from '../Tags';
import DeletePostButton from '../DeletePostButton';

import './ShowcaseCard.sass';

const ShowcaseCard = ({ post, isAuthor }) => (
  <div className="showcase__card">
    <Link to={`/post/${post._id}`} className="showcase__card-link">
      <h5 className="showcase__card-title">{post.title}</h5>
    </Link>
    <Tags tags={post.tags} />
    <div className="showcase__footer">
      <div className="showcase__feedback">
        <i className="icon heart fas fa-heart" />
        <span className="showcase__feedback-count">{post.likesCount}</span>
      </div>
      <div className="showcase__feedback">
        <i className="icon comments-icon fas fa-comments" />
        <span className="showcase__feedback-count">{post.commentsCount}</span>
      </div>
      {isAuthor && <DeletePostButton postId={post._id} />}
    </div>
  </div>
);

ShowcaseCard.propTypes = {
  post: shape({
    _id: string.isRequired,
    title: string.isRequired,
    likesCount: number.isRequired,
    tags: arrayOf(string).isRequired,
    commentsCount: number.isRequired,
  }).isRequired,
  isAuthor: bool.isRequired,
};

export default ShowcaseCard;
