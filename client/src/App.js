import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';
import apolloClient from './ApolloClient';
import NavBar from './components/NavBar';
import Users from './components/Users';
import Home from './components/Home';
import Footer from './components/Footer';
import { UserContext, MemberFormsContext } from './context';
import queries from './graphql/queries';
import PostEditor from './components/PostEditor';
import Posts from './components/Posts';
import Post from './components/Post';
import Inbox from './components/Inbox/Inbox';
import UserProfile from './components/UserProfile';
import CurrentUserProfile from './components/CurrentUserProfile';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './App.sass';

const App = () => {
  const [loggedUser, setLoggedUser] = useState(null);
  const [token, setToken] = useState(null);

  const [showMemberForms, setShowMemberForms] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const toggleForms = () => {
    console.log('toggling');
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    if (loggedUser) setShowMemberForms(false);
  }, [showMemberForms]);

  useLayoutEffect(() => {
    const cachedToken = localStorage.getItem('token');

    if (cachedToken) {
      console.log('setting token');
      setToken(cachedToken);
      relog();
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setLoggedUser(null);
  };

  const relog = async () => {
    console.log('relogging');
    try {
      const { data: { relog: relogResult } } = await apolloClient.mutate({
        mutation: queries.RELOG,
      });
      console.log(relogResult);
      setLoggedUser(relogResult);
    } catch (error) {
      console.log('relog error', error.message);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  return (
    <>
      <UserContext.Provider
        value={{
          loggedUser,
          setLoggedUser,
          setToken,
          isLogged: !!loggedUser,
        }}
      >
        <MemberFormsContext.Provider
          value={{
            showMemberForms,
            setShowMemberForms,
            showLogin,
            setShowLogin,
            toggleForms,
          }}
        >
          <div className="App">
            <NavBar logout={logout} />
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
        position="top-right"
        offset={60}
        stack={{ limit: 5 }}
        timeout={5000}
      />
    </>
  );
};

export default App;
