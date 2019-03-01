import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  string, arrayOf, shape, func,
} from 'prop-types';

import './NavBarUserMenu.sass';

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
      <button
        className="user-menu__btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') setIsOpen(!isOpen);
        }}
      >
        <img
          className="user-menu__avatar"
          src={loggedUser.avatar}
          alt={loggedUser.username}
        />
      </button>
      {isOpen && (
        <div ref={dropdown} className="dropdown__container">
          <ul className="dropdown faster animated fadeIn">
            <li className="dropdown__item">
              <Link to="/create" className="dropdown__link">
                <i className="dropdown__icon fas fa-plus" />
                Create post
              </Link>
            </li>
            <li className="dropdown__item">
              <Link to="/profile/posts" className="dropdown__link">
                <i className="dropdown__icon fas fa-user" />
                Profile
              </Link>
            </li>
            <li className="dropdown__item">
              <Link to="/profile/posts" className="dropdown__link">
                <i className="dropdown__icon fas fa-newspaper" />
                Posts
              </Link>
            </li>
            <li className="dropdown__item">
              <Link to="/profile/inbox" className="dropdown__link">
                <i className="dropdown__icon fas fa-inbox" />
                Inbox
              </Link>
            </li>
            <li className="dropdown__item">
              <Link to="/profile/posts" className="dropdown__link">
                <i className="dropdown__icon fas fa-comments" />
                Comments
              </Link>
            </li>
            <div className="dropdown__divider" />
            <li
              className="dropdown__item dropdown__link"
              onClick={logout}
              onKeyPress={(e) => {
                if (e.key === 'Enter') logout();
              }}
            >
              <i className="dropdown__icon fas fa-sign-out-alt" />
              Log Out
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
