import React, { useContext } from 'react';
import { func } from 'prop-types';
import { UserContext } from '../../context';
import NavBarUserMenu from '../NavBarUserMenu';
import FriendRequestNotifications from '../FriendRequestNotifications';

const NavBarUserPanel = ({ logout }) => {
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="navbar-user-panel">
      <FriendRequestNotifications />
      <NavBarUserMenu loggedUser={loggedUser} logout={logout} />
    </div>
  );
};

NavBarUserPanel.propTypes = {
  logout: func.isRequired,
};

export default NavBarUserPanel;
