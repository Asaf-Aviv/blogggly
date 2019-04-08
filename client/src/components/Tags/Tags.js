import React from 'react';
import { arrayOf, string } from 'prop-types';
import { Link } from 'react-router-dom';

import './Tags.sass';

const Tags = ({ tags }) => (
  <div className="tags" onClick={e => e.stopPropagation()}>
    {tags.map(tag => (
      <Link className="tags__link" key={tag} to={`/posts/tag/${tag}`}>
        <span>{tag}</span>
      </Link>
    ))}
  </div>
);

Tags.propTypes = {
  tags: arrayOf(string).isRequired,
};

export default Tags;
