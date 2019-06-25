import React, { useState, useRef } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { shape, string, func } from 'prop-types';
import { capitalize } from 'lodash';
import UploadAvatar from '../UploadAvatar';
import useOutsideClick from '../../hooks/useOutsideClick';

import './UserProfileNav.sass';
import useWindowWidth from '../../hooks/useWindowWidth';

const UserProfileNavLink = ({ to, onClick }) => (
  <li className="user-profile__menu-item">
    <NavLink
      activeClassName="user-profile__menu-link--active"
      className="user-profile__menu-link"
      to={to}
      onClick={onClick}
    >
      {capitalize(to.split('/')[2])}
    </NavLink>
  </li>
);

UserProfileNavLink.propTypes = {
  to: string.isRequired,
  onClick: func,
};

UserProfileNavLink.defaultProps = {
  onClick: null,
};

const renderLinks = (url, onClick) => (
  <ul className="user-profile__menu">
    <UserProfileNavLink onClick={onClick} to={`${url}/information`} />
    <UserProfileNavLink onClick={onClick} to={`${url}/posts`} />
    <UserProfileNavLink onClick={onClick} to={`${url}/comments`} />
    <UserProfileNavLink onClick={onClick} to={`${url}/followers`} />
    <UserProfileNavLink onClick={onClick} to={`${url}/following`} />
    <UserProfileNavLink onClick={onClick} to={`${url}/friends`} />
    <UserProfileNavLink onClick={onClick} to={`${url}/likes`} />
  </ul>
);

const MobileUserProfileNav = withRouter(({ location: { pathname }, match: { url } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  useOutsideClick(navRef, () => setIsOpen(false));

  const toggleNav = () => setIsOpen(prevState => !prevState);

  return (
    <>
      <nav
        ref={navRef}
        className={`user-profile__mobile-nav ${isOpen ? 'user-profile__mobile-nav--open' : ''}`}
      >
        {renderLinks(url, toggleNav)}
      </nav>
      {!isOpen && (
        <div onClick={toggleNav} className="mobile-nav__location-container">
          <span
            className="mobile-nav__location"
          >
            {capitalize(pathname.slice(9))}
          </span>
          <i className="fas fa-angle-up" />
        </div>
      )}
    </>
  );
});

MobileUserProfileNav.propTypes = {
  locations: shape({
    pathname: string.isRequired,
  }),
  match: shape({
    url: string.isRequired,
  }).isRequired,
};

const DesktopUserProfileNav = ({ match: { url } }) => (
  <nav className="user-profile__sidebar">
    <UploadAvatar />
    {renderLinks(url)}
  </nav>
);

DesktopUserProfileNav.propTypes = {
  match: shape({
    url: string.isRequired,
  }).isRequired,
};

const DesktopUserProfileNavWithRouter = withRouter(DesktopUserProfileNav);
const MobileUserProfileNavWithRouter = withRouter(MobileUserProfileNav);

const UserProfileNav = () => (
  useWindowWidth() >= 600
    ? <DesktopUserProfileNavWithRouter />
    : <MobileUserProfileNavWithRouter />
);

export default UserProfileNav;
