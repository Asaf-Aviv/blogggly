import React from 'react';
import { Link } from 'react-router-dom';
import {
  shape, number, string, arrayOf,
} from 'prop-types';

import './ShowcaseCard.sass';
import Tags from '../Tags/Tags';

const ShowcaseCard = ({ post }) => (
  <Link key={post._id} className="showcase__link" to={`/posts/${post._id}`}>
    <div className="showcase__card">
      <h3 className="showcase__card-title">{post.title}</h3>
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
      </div>
    </div>
  </Link>
);

ShowcaseCard.propTypes = {
  post: shape({
    _id: string.isRequired,
    title: string.isRequired,
    likesCount: number.isRequired,
    tags: arrayOf(string).isRequired,
    commentsCount: number.isRequired,
  }).isRequired,
};

export default ShowcaseCard;
