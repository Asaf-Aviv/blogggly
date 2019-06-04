import React, { useRef } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';
import { hot } from 'react-hot-loader/root';
import { useImmer } from 'use-immer';
import NavBar from './components/NavBar';
import Users from './components/Users';
import Home from './components/Home';
import Footer from './components/Footer';
import { UserContext, MemberFormsContext } from './context';
import PostEditor from './components/PostEditor';
import Posts from './components/Posts';
import Post from './components/Post';
import Inbox from './components/Inbox/Inbox';
import UserProfile from './components/UserProfile';
import CurrentUserProfile from './components/CurrentUserProfile';
import useDarkMode from './hooks/useDarkMode';
import useToken from './hooks/useToken';
import useMemberForms from './hooks/useMemberForms';
import useUserSubscriptions from './hooks/useUserSubsciptions';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './App.sass';

const App = () => {
  const [loggedUser, setLoggedUser] = useImmer(null);
  const [isDarkMode, toggleDarkMode] = useDarkMode();
  const memberForms = useMemberForms(Boolean(loggedUser));
  const { setToken, logout } = useToken(Boolean(loggedUser), setLoggedUser);

  const subscriptionRef = useRef();
  useUserSubscriptions(subscriptionRef, loggedUser, setLoggedUser);

  return (
    <>
      <UserContext.Provider value={{
        loggedUser, setLoggedUser, setToken, isLogged: Boolean(loggedUser),
      }}
      >
        <MemberFormsContext.Provider value={memberForms}>
          <div className={`App ${isDarkMode ? 'dark-theme' : ''}`}>
            <NavBar logout={logout} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/posts/tag/:tag" exact component={Posts} />
              <Route path="/post/:postId" exact component={Post} />
              <Route path="/user/:username" exact component={UserProfile} />
              <Route path="/users" exact component={Users} />
              <Route path="/profile" component={CurrentUserProfile} />
              <Route path="/inbox" exact component={Inbox} />
              <Route path="/create" exact component={PostEditor} />
              <Route render={() => <Redirect to="/" />} />
            </Switch>
            <Footer />
          </div>
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
