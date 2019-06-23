import React, { useRef } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';
import { hot } from 'react-hot-loader/root';
import { useImmer } from 'use-immer';
import NavBar from './components/NavBar';
import Users from './components/Users';
import Home from './components/Home';
import Footer from './components/Footer';
import { UserContext, MemberFormsContext, DarkModeContext } from './context';
import PostEditor from './components/PostEditor';
import Posts from './components/Posts';
import Post from './components/Post';
import PostsByTag from './components/PostsByTag';
import Inbox from './components/Inbox';
import Forgot from './components/Forgot';
import ResetPassword from './components/ResetPassword';
import UserProfile from './components/UserProfile';
import CurrentUserProfile from './components/CurrentUserProfile';
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
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/posts" component={Posts} />
                <Route path="/posts/tag/:tag" component={PostsByTag} />
                <Route path="/post/:postId" component={Post} />
                <Route path="/user/:username" component={UserProfile} />
                <Route path="/users" component={Users} />
                <Route path="/profile" component={CurrentUserProfile} />
                <Route path="/inbox" component={Inbox} />
                <Route path="/create" component={PostEditor} />
                <Route path="/forgot" component={Forgot} />
                <Route path="/reset/:resetToken" component={ResetPassword} />
                <Route render={() => <Redirect to="/" />} />
              </Switch>
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
