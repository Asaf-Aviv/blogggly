import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import {
  string, arrayOf, shape, func,
} from 'prop-types';
import UserAvatar from '../UserAvatar/UserAvatar';

import './NavBarUserMenu.sass';
import Button from '../Button';

const NavBarUserMenu = ({ loggedUser, logout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdown = useRef(null);

  useEffect(() => {
    document.addEventListener('mousedown', detectClick);
    return () => {
      document.removeEventListener('mousedown', detectClick);
    };
  }, []);

  const detectClick = (e) => {
    if (dropdown
      && dropdown.current
      && !dropdown.current.contains(e.target)
      && !e.target.classList.contains('user-menu__avatar')
    ) {
      setIsOpen(false);
    }
  };

  return (
    <div className="user-menu">
      <Button
        classes="user-menu__btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <UserAvatar
          classes="user-menu__avatar"
          username={loggedUser.username}
          avatar={loggedUser.avatar}
        />
      </Button>
      {isOpen && (
        <div ref={dropdown} className="dropdown__container">
          <ul className="dropdown" onClick={() => setIsOpen(false)}>
            <li className="dropdown__item">
              <NavLink activeClassName="dropdown__link--active" to="/create" className="dropdown__link">
                <i className="dropdown__icon fas fa-plus" />
                Create
              </NavLink>
            </li>
            <li className="dropdown__item">
              <NavLink activeClassName="dropdown__link--active" to="/profile/information" className="dropdown__link">
                <i className="dropdown__icon fas fa-user" />
                Profile
              </NavLink>
            </li>
            <li className="dropdown__item">
              <NavLink activeClassName="dropdown__link--active" to="/inbox" className="dropdown__link">
                <i className="dropdown__icon fas fa-inbox" />
                Inbox
              </NavLink>
            </li>
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
