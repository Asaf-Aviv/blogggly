import React, { useContext, useState } from 'react';
import { func, number } from 'prop-types';
import { MemberFormsContext, UserContext, DarkModeContext } from '../../context';
import Container from '../Container';
import MemberForms from '../MemberForms';
import NavMenu from '../NavMenu';
import NavBarUserPanel from '../NavBarUserPanel';
import Button from '../Button';
import Toggler from '../Toggler';
import NavSearchBar from '../NavSearchBar';
import { ReactComponent as MenuIcon } from '../../assets/menu.svg';

import './NavBar.sass';

const NavBar = ({ logout, windowWidth }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const { isLogged } = useContext(UserContext);
  const { showMemberForms, setShowMemberForms, setShowLogin } = useContext(MemberFormsContext);
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  const setNavState = nextState => () => setIsNavOpen(nextState || !isNavOpen);

  return (
    <header className="navbar">
      <Container>
        <nav className="nav">
          <NavMenu closeNav={setNavState(false)} isNavOpen={isNavOpen} />
          <div className="nav__section hamburger__container">
            <MenuIcon className="hamburger" onClick={setNavState()} />
          </div>
          <NavSearchBar />
          {showMemberForms && !isLogged && <MemberForms />}
          <div className="nav__section">
            {windowWidth >= 600 && <Toggler checked={isDarkMode} onChange={toggleDarkMode} />}
            {isLogged ? (
              <NavBarUserPanel windowWidth={windowWidth} logout={logout} />
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
          </div>
        </nav>
      </Container>
    </header>
  );
};

NavBar.propTypes = {
  logout: func.isRequired,
  windowWidth: number.isRequired,
};

export default NavBar;
