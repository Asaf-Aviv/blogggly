import React, { useRef } from 'react';
import Alert from 'react-s-alert';
import { hot } from 'react-hot-loader/root';
import { useImmer } from 'use-immer';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import { UserContext, MemberFormsContext, DarkModeContext } from './context';
// import Chat from './components/Chat';
import Routes from './components/Routes';
import useDarkMode from './hooks/useDarkMode';
import useToken from './hooks/useToken';
import useMemberForms from './hooks/useMemberForms';
import useUserSubscriptions from './hooks/useUserSubsciptions';
import useWindowWidth from './hooks/useWindowWidth';

import 'simplebar/dist/simplebar.min.css';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './App.sass';

const App = () => {
  const [loggedUser, setLoggedUser] = useImmer(null);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const memberForms = useMemberForms(Boolean(loggedUser));
  const { setToken, logout } = useToken(Boolean(loggedUser), setLoggedUser);
  const windowWidth = useWindowWidth();

  const subscriptionRef = useRef();
  useUserSubscriptions(subscriptionRef, loggedUser, setLoggedUser);

  return (
    <>
      <UserContext.Provider value={{
        loggedUser, setLoggedUser, setToken, isLogged: Boolean(loggedUser),
      }}
      >
        <MemberFormsContext.Provider value={memberForms}>
          <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            <div className="App">
              <NavBar logout={logout} windowWidth={windowWidth} />
              {/* <Chat /> */}
              <Routes />
              <Footer />
            </div>
          </DarkModeContext.Provider>
        </MemberFormsContext.Provider>
      </UserContext.Provider>
      <Alert
        effect="jelly"
        position="top-left"
        offset={60}
        stack={{ limit: 5 }}
        timeout={5000}
      />
    </>
  );
};

export default hot(App);
