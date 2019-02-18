import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserContext } from '../../context';
import Container from '../Container';
import MemberForms from '../MemberForms';
import NavBarUserMenu from '../NavBarUserMenu';

import './NavBar.sass';

const NavBar = ({ logout }) => {
  const [showMemberForms, setShowMemberForms] = useState(false);
  const { loggedUser } = useContext(UserContext);

  const toggleForms = () => {
    setShowMemberForms(!showMemberForms);
  };

  const NavMenu = () => (
    <ul className="nav-menu">
      <li className="nav-menu__item">
        <NavLink className="nav-menu__link" to="/">Home</NavLink>
      </li>
      <li className="nav-menu__item">
        <NavLink className="nav-menu__link" to="/users">Users</NavLink>
      </li>
      <li className="nav-menu__item">
        <NavLink className="nav-menu__link" to="/blogs">Blogs</NavLink>
      </li>
    </ul>
  );

  return (
    <header className="navbar">
      <Container>
        <nav className="nav">
          <NavMenu />
          {loggedUser
            ? <NavBarUserMenu loggedUser={loggedUser} logout={logout} />
            : <button type="button" className="login-btn btn btn--primary" onClick={toggleForms}>Log In</button>
          }
          {showMemberForms && <MemberForms hideForms={toggleForms} />}
        </nav>
      </Container>
    </header>
  );
};

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default NavBar;
