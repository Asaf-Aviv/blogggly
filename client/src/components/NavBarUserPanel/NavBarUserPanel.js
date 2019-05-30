import React, { useContext } from 'react';
import { func } from 'prop-types';
import { UserContext } from '../../context';
import NavBarUserMenu from '../NavBarUserMenu';
import Notifications from '../Notifications';
import FriendRequestNotifications from '../FriendRequestNotifications';
import NavNotification from '../NavNotifications';

import './NavBarUserPanel.sass';

const NavBarUserPanel = ({ logout }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="navbar-user-panel">
      <NavNotification iconClass="fas fa-bell">
        <Notifications />
      </NavNotification>
      <NavNotification iconClass="fas fa-user-plus">
        <FriendRequestNotifications />
      </NavNotification>
      <NavBarUserMenu loggedUser={loggedUser} logout={logout} />
    </div>
  );
};

NavBarUserPanel.propTypes = {
  logout: func.isRequired,
};

export default NavBarUserPanel;
