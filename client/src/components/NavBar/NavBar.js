import React, { useContext } from 'react';
import { func } from 'prop-types';
import { MemberFormsContext, UserContext } from '../../context';
import Container from '../Container';
import MemberForms from '../MemberForms';
import NavMenu from '../NavMenu';
import NavBarUserPanel from '../NavBarUserPanel';
import NavSearchBar from '../NavSearchBar';

import './NavBar.sass';
import Button from '../Button';

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
            <Button
              classes="login-btn btn btn--primary"
              text="Log In"
              onClick={() => {
                setShowLogin(true);
                setShowMemberForms(true);
              }}
            />
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
