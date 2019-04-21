import React, { useContext } from 'react';
import { func } from 'prop-types';
import { MemberFormsContext } from '../../context';
import Container from '../Container';
import MemberForms from '../MemberForms';
import NavBarUserMenu from '../NavBarUserMenu';
import NavMenu from '../NavMenu';

import './NavBar.sass';

const NavBar = ({ logout }) => {
  const {
    loggedUser, showMemberForms, setShowMemberForms, setShowLogin,
  } = useContext(MemberFormsContext);

  return (
    <header className="navbar">
      <Container>
        <nav className="nav">
          <NavMenu />
          {loggedUser
            ? <NavBarUserMenu loggedUser={loggedUser} logout={logout} />
            : (
              <button
                type="button"
                className="login-btn btn btn--primary"
                onClick={() => {
                  setShowLogin(true);
                  setShowMemberForms(true);
                }}
              >
                Log In
              </button>
            )
          }
          {showMemberForms && !loggedUser && <MemberForms />}
        </nav>
      </Container>
    </header>
  );
};

NavBar.propTypes = {
  logout: func.isRequired,
};

export default NavBar;
