import React, { useContext } from 'react';
import { func, bool } from 'prop-types';
import { MemberFormsContext, UserContext } from '../../context';
import Container from '../Container';
import MemberForms from '../MemberForms';
import NavMenu from '../NavMenu';
import NavBarUserPanel from '../NavBarUserPanel';
import Button from '../Button';
import Toggler from '../Toggler';
import NavSearchBar from '../NavSearchBar';

import './NavBar.sass';

const NavBar = ({ logout, isDarkMode, toggleDarkMode }) => {
  const { isLogged } = useContext(UserContext);

  const { showMemberForms, setShowMemberForms, setShowLogin } = useContext(MemberFormsContext);

  return (
    <header className="navbar">
      <Container>
        <nav className="nav">
          <NavMenu />
          <NavSearchBar />
          <Toggler checked={isDarkMode} onChange={toggleDarkMode} />
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
  isDarkMode: bool.isRequired,
  toggleDarkMode: func.isRequired,
};

export default NavBar;
