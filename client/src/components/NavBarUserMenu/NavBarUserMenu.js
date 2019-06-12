import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  string, arrayOf, shape, func,
} from 'prop-types';
import Button from '../Button';
import useOutsideClick from '../../hooks/useOutsideClick';
import UserAvatar from '../UserAvatar/UserAvatar';

import './NavBarUserMenu.sass';

const renderItem = (to, iconClass, text) => (
  <li className="dropdown__item">
    <NavLink to={to} className="dropdown__link">
      <i className={`dropdown__icon fas ${iconClass}`} />
      {text}
    </NavLink>
  </li>
);

const NavBarUserMenu = ({ loggedUser, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdown = useRef(null);
  useOutsideClick(dropdown, () => setIsOpen(false));

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
  loggedUser: shape({
    _id: string.isRequired,
    username: string.isRequired,
    email: string.isRequired,
    posts: arrayOf(string).isRequired,
    avatar: string.isRequired,
    createdAt: string.isRequired,
    comments: arrayOf(string).isRequired,
  }),
  logout: func.isRequired,
};

NavBarUserMenu.defaultProps = {
  loggedUser: null,
};

export default NavBarUserMenu;
