import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { string, func } from 'prop-types';

import './BloggglyLink.sass';

const BloggglyLink = ({
  to, text, classes, activeClassName, onClick,
}) => (
  activeClassName
    ? (
      <NavLink
        onClick={onClick}
        to={to}
        className={`blogggly-link ${classes}`}
        activeClassName={activeClassName}
      >
        {text}
      </NavLink>
    )
    : (
      <Link
        onClick={onClick}
        to={to}
        className={`blogggly-link ${classes}`}
      >
        {text}
      </Link>
    )
);

BloggglyLink.propTypes = {
  to: string.isRequired,
  classes: string,
  text: string,
  activeClassName: string,
  onClick: func,
};

BloggglyLink.defaultProps = {
  text: '',
  activeClassName: '',
  classes: '',
  onClick: null,
};

export default BloggglyLink;
