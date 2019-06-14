import React from 'react';
import { bool, func } from 'prop-types';
import BloggglyLink from '../BloggglyLink';

import './NavMenu.sass';

const navLink = (to, text, onClick) => (
  <li className="nav-menu__item">
    <BloggglyLink
      to={to}
      onClick={onClick}
      classes="nav-menu__link"
      activeClassName="nav-menu__link--active"
      text={text}
    />
  </li>
);

const NavMenu = ({ isNavOpen, closeNav }) => (
  <div
    className={`nav-menu__container ${isNavOpen ? 'nav-menu__container--open' : ''}`}
    onClick={closeNav}
  >
    <ul className="nav-menu" onClick={e => e.stopPropagation()}>
      {navLink('/', 'Home', closeNav)}
      {navLink('/posts', 'Posts', closeNav)}
      {navLink('/users', 'Users', closeNav)}
      {navLink('/create', 'Create', closeNav)}
    </ul>
  </div>
);

NavMenu.propTypes = {
  isNavOpen: bool.isRequired,
  closeNav: func.isRequired,
};

export default NavMenu;
