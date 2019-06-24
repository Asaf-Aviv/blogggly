import React from 'react';
import { func, number } from 'prop-types';
import NavBarUserMenu from '../NavBarUserMenu';
import NotificationsWrapper from '../NotificationsWrapper';

import './NavBarUserPanel.sass';

const NavBarUserPanel = ({ logout, windowWidth }) => (
  <div className="navbar-user-panel">
    {windowWidth >= 900 && <NotificationsWrapper />}
    <NavBarUserMenu logout={logout} windowWidth={windowWidth} />
  </div>
);

NavBarUserPanel.propTypes = {
  logout: func.isRequired,
  windowWidth: number.isRequired,
};

export default NavBarUserPanel;
