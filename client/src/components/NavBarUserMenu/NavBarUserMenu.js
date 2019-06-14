import React, { useState, useRef, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { func, number } from 'prop-types';
import Button from '../Button';
import useOutsideClick from '../../hooks/useOutsideClick';
import UserAvatar from '../UserAvatar';
import NotificationsWrapper from '../NotificationsWrapper';
import Toggler from '../Toggler';
import { DarkModeContext, UserContext } from '../../context';

import './NavBarUserMenu.sass';

const renderItem = (to, iconClass, text) => (
  <li className="dropdown__item">
    <NavLink to={to} className="dropdown__link">
      <i className={`dropdown__icon fas ${iconClass}`} />
      {text}
    </NavLink>
  </li>
);

const NavBarUserMenu = ({ logout, windowWidth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdown = useRef(null);
  useOutsideClick(dropdown, () => setIsOpen(false));
  const { loggedUser } = useContext(UserContext);

  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  return (
    <div ref={dropdown} className="user-menu">
      <Button
        classes="user-menu__btn animated bounceIn fast delay-300ms"
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserAvatar
          width={40}
          classes="user-menu__avatar"
          username={loggedUser.username}
          avatar={loggedUser.avatar}
        />
      </Button>
      {isOpen && (
        <div className="dropdown__container">
          <div className="user-menu__header">
            <UserAvatar
              width={40}
              classes="user-menu__avatar"
              username={loggedUser.username}
              avatar={loggedUser.avatar}
            />
            <h4 className="user-menu__username">{loggedUser.username}</h4>
          </div>
          {windowWidth < 600 && (
            <>
              <div className="dropdown__divider" />
              <div className="notifications__mobile">
                <Toggler checked={isDarkMode} onChange={toggleDarkMode} />
                <NotificationsWrapper />
              </div>
            </>
          )}
          <div className="dropdown__divider" />
          <ul className="dropdown" onClick={() => setIsOpen(false)}>
            {renderItem('/create', 'fa-plus', 'Create')}
            {renderItem('/profile/information', 'fa-user', 'Profile')}
            {renderItem('/inbox', 'fa-inbox', 'Inbox')}
            <div className="dropdown__divider" />
            <li
              className="dropdown__item"
              onClick={logout}
            >
              <span className="dropdown__link">
                <i className="dropdown__icon fas fa-sign-out-alt" />
                Log Out
              </span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

NavBarUserMenu.propTypes = {
  logout: func.isRequired,
  windowWidth: number.isRequired,
};

export default NavBarUserMenu;
