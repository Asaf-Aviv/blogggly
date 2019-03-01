import React from 'react';
import { NavLink } from 'react-router-dom';

import './NavMenu.sass';

const NavMenu = () => (
  <ul className="nav-menu">
    <li className="nav-menu__item">
      <NavLink className="nav-menu__link" to="/">Home</NavLink>
    </li>
    <li className="nav-menu__item">
      <NavLink className="nav-menu__link" to="/posts">Posts</NavLink>
    </li>
    <li className="nav-menu__item">
      <NavLink className="nav-menu__link" to="/users">Users</NavLink>
    </li>
    <li className="nav-menu__item">
      <NavLink className="nav-menu__link" to="/create">Create</NavLink>
    </li>
  </ul>
);

export default NavMenu;
