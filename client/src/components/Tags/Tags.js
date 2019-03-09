import React from 'react';
import { arrayOf, string } from 'prop-types';
import { Link } from 'react-router-dom';

import './Tags.sass';

const Tags = ({ tags }) => (
  <div className="tags">
    {tags.map(tag => (
      <Link to={{ pathname: '/posts', search: `?tags=${tag}` }}>
        <span className="tags__item" key={tag}>{tag}</span>
      </Link>
    ))}
  </div>
);

Tags.propTypes = {
  tags: arrayOf(string).isRequired,
};

export default Tags;
