import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavMenu.sass';

const navLink = (to, text) => (
  <li className="nav-menu__item">
    <NavLink
      activeClassName="nav-menu__link--active"
      className="nav-menu__link"
      exact
      to={to}
    >
      {text}
    </NavLink>
  </li>
);

const NavMenu = () => (
  <ul className="nav-menu">
    {navLink('/', 'Home')}
    {navLink('/posts', 'Posts')}
    {navLink('/users', 'Users')}
    {navLink('/create', 'Create')}
  </ul>
);

export default NavMenu;
