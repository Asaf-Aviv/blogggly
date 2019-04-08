import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { shape, string } from 'prop-types';

import './UserProfileNav.sass';

const UserProfileNavLink = ({ to, text }) => (
  <li className="user-profile__menu-item">
    <NavLink
      activeClassName="user-profile__menu-link--active"
      className="user-profile__menu-link"
      to={to}
    >
      {text}
    </NavLink>
  </li>
);

UserProfileNavLink.propTypes = {
  to: string.isRequired,
  text: string.isRequired,
};

const UserProfileNav = ({ match }) => (
  <nav className="user-profile__sidebar">
    <ul className="user-profile__menu">
      <UserProfileNavLink to={`${match.url}/information`} text="Information" />
      <UserProfileNavLink to={`${match.url}/posts`} text="Posts" />
      <UserProfileNavLink to={`${match.url}/comments`} text="Comments" />
      <UserProfileNavLink to={`${match.url}/followers`} text="Followers" />
      <UserProfileNavLink to={`${match.url}/following`} text="Following" />
      <UserProfileNavLink to={`${match.url}/likes`} text="Likes" />
    </ul>
  </nav>
);

UserProfileNav.propTypes = {
  match: shape({
    url: string.isRequired,
  }).isRequired,
};

export default withRouter(UserProfileNav);
