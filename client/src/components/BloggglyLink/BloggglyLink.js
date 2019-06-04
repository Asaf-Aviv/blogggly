import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { string } from 'prop-types';

import './BloggglyLink.sass';

const BloggglyLink = ({
  to, text, classes, activeClassName,
}) => (
  activeClassName
    ? (
      <NavLink to={to} className={`blogggly-link ${classes}`} activeClassName={activeClassName}>
        {text}
      </NavLink>
    )
    : (
      <Link to={to} className={`blogggly-link ${classes}`}>
        {text}
      </Link>
    )
);

BloggglyLink.propTypes = {
  to: string.isRequired,
  classes: string,
  text: string,
  activeClassName: string,
};

BloggglyLink.defaultProps = {
  text: '',
  activeClassName: '',
  classes: '',
};

export default BloggglyLink;
