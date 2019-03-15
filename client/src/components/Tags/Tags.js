import React from 'react';
import {
  arrayOf, string, shape, func,
} from 'prop-types';
import { withRouter } from 'react-router-dom';

import './Tags.sass';

const Tags = ({ tags, history }) => (
  <div className="tags">
    {tags.map(tag => (
      <span
        className="tags__item"
        key={tag}
        onClick={() => history.push(`/posts?tags=${tag}`)}
      >
        {tag}
      </span>
    ))}
  </div>
);

Tags.propTypes = {
  tags: arrayOf(string).isRequired,
  history: shape({
    push: func.isRequired,
  }).isRequired,
};

export default withRouter(Tags);
