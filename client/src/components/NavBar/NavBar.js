import React, { useContext } from 'react';
import { func } from 'prop-types';
import { MemberFormsContext, UserContext } from '../../context';
import Container from '../Container';
import MemberForms from '../MemberForms';
import NavMenu from '../NavMenu';
import NavBarUserPanel from '../NavBarUserPanel';
import NavSearchBar from '../NavSearchBar';

import './NavBar.sass';

const NavBar = ({ logout }) => {
  const { isLogged } = useContext(UserContext);

  const { showMemberForms, setShowMemberForms, setShowLogin } = useContext(MemberFormsContext);

  return (
    <header className="navbar">
      <Container>
        <nav className="nav">
          <NavMenu />
          <NavSearchBar />
          {isLogged ? (
            <NavBarUserPanel logout={logout} />
          ) : (
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
          )}
          {showMemberForms && !isLogged && <MemberForms />}
        </nav>
      </Container>
    </header>
  );
};

NavBar.propTypes = {
  logout: func.isRequired,
};

export default NavBar;
