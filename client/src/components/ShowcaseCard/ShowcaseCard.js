import React from 'react';
import {
  shape, number, string, arrayOf, bool,
} from 'prop-types';
import Tags from '../Tags';
import BloggglyLink from '../BloggglyLink';
import ActionsDropDown from '../ActionsDropDown';

import './ShowcaseCard.sass';

const ShowcaseCard = ({ post, isAuthor }) => (
  <div className="showcase__card animated faster zoomIn">
    <BloggglyLink to={`/post/${post._id}`} text={post.title} />
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
      {<ActionsDropDown type="post" resourceId={post._id} isAuthor={isAuthor} />}
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
