import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';
import { hot } from 'react-hot-loader/root';
import { useImmer } from 'use-immer';
import { Subscription } from 'react-apollo';
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
import { wsClient } from './ApolloClient/ApolloClient';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './App.sass';

const App = () => {
  const [loggedUser, setLoggedUser] = useImmer(null);
  const [token, setToken] = useState(null);

  const [showMemberForms, setShowMemberForms] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const toggleForms = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    if (loggedUser) setShowMemberForms(false);
  }, [loggedUser, showMemberForms]);

  useLayoutEffect(() => {
    const cachedToken = localStorage.getItem('token');

    const relog = async () => {
      try {
        const { data: { relog: relogResult } } = await apolloClient.mutate({
          mutation: queries.RELOG,
        });
        console.log(relogResult);
        setLoggedUser(() => relogResult);
      } catch (error) {
        setToken(null);
        localStorage.removeItem('token');
      }
    };

    if (cachedToken) relog();
  }, [setLoggedUser]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      wsClient.close(false, false);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setLoggedUser(() => null);
  };

  return (
    <>
      {!!loggedUser && (
        <Subscription
          subscription={queries.NEW_FRIEND_REQUEST}
          variables={{ currentUserId: loggedUser._id }}
        >
          {({ loading, error, data }) => {
            if (loading) console.log(loading);
            if (error) console.log(error);
            if (data) console.log(data);
            return null;
          }}
        </Subscription>
      )}
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

export default hot(App);
