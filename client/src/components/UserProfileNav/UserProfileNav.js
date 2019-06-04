import React from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { capitalize } from 'lodash';

import './UserProfileNav.sass';

const UserProfileNavLink = ({ to }) => (
  <li className="user-profile__menu-item">
    <NavLink
      activeClassName="user-profile__menu-link--active"
      className="user-profile__menu-link"
      to={to}
    >
      {capitalize(to.split('/')[2])}
    </NavLink>
  </li>
);

UserProfileNavLink.propTypes = {
  to: string.isRequired,
};

const UserProfileNav = ({ match: { url } }) => (
  <nav className="user-profile__sidebar">
    <ul className="user-profile__menu">
      <UserProfileNavLink to={`${url}/information`} />
      <UserProfileNavLink to={`${url}/posts`} />
      <UserProfileNavLink to={`${url}/comments`} />
      <UserProfileNavLink to={`${url}/followers`} />
      <UserProfileNavLink to={`${url}/following`} />
      <UserProfileNavLink to={`${url}/friends`} />
      <UserProfileNavLink to={`${url}/likes`} />
    </ul>
  </nav>
);

UserProfileNav.propTypes = {
  match: shape({
    url: string.isRequired,
  }).isRequired,
};

export default withRouter(UserProfileNav);
