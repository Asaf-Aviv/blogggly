import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';
import apolloClient from './ApolloClient';
import NavBar from './components/NavBar';
import Users from './components/Users';
import Home from './components/Home';
import { UserContext } from './context';
import queries from './graphql/queries';
import PostEditor from './components/PostEditor';
import UserPosts from './components/UserPosts';
import Posts from './components/Posts';
import Post from './components/Post';
import Inbox from './components/Inbox/Inbox';
import User from './components/User';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './App.sass';

const App = () => {
  const [token, setToken] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);

  useLayoutEffect(() => {
    const cachedToken = localStorage.getItem('token');

    console.log(cachedToken);

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
    <UserContext.Provider value={{ loggedUser, setLoggedUser, setToken }}>
      <div className="App">
        <NavBar logout={logout} />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/posts" exact component={Posts} />
          <Route path="/posts/:postId" component={Post} />
          <Route path="/users/:username" component={User} />
          <Route path="/profile/posts" component={UserPosts} />
          <Route path="/profile/inbox" component={Inbox} />
          <Route path="/users" component={Users} />
          <Route path="/create" component={PostEditor} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </div>
      <Alert
        effect="jelly"
        position="top-right"
        offset={60}
        stack={{ limit: 5 }}
        timeout={5000}
      />
    </UserContext.Provider>
  );
};


export default App;
