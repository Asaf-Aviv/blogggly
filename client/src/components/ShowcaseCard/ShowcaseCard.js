import React from 'react';
import { Link } from 'react-router-dom';
import { shape, number, string } from 'prop-types';

import './ShowcaseCard.sass';

const ShowcaseCard = ({ post }) => (
  <Link key={post._id} className="showcase__link" to={`/posts/${post._id}`}>
    <div className="showcase__card">
      <h3 className="card__title">{post.title}</h3>
      <span dangerouslySetInnerHTML={{ __html: post.shortBody }} />
      <div className="showcase__like">
        <i className="heart fa-heart fas" />
        <span>{post.likeCount}</span>
      </div>
    </div>
  </Link>
);

ShowcaseCard.propTypes = {
  post: shape({
    _id: string.isRequired,
    title: string.isRequired,
    shortBody: string.isRequired,
    likeCount: number.isRequired,
  }).isRequired,
};

export default ShowcaseCard;
