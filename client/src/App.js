import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';
import apolloClient from './ApolloClient';
import NavBar from './components/NavBar';
import Users from './components/Users';
import Home from './components/Home';
import { UserContext, FormContext } from './context';
import queries from './graphql/queries';
import PostEditor from './components/PostEditor';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './App.sass';

const App = () => {
  const [token, setToken] = useState(null);
  const [loggedUser, setLoggedUser] = useState(null);
  const [alerts, setAlerts] = useState([
    { message: 'Incorrect password.' },
    { message: 'Incorrect email.' },
    { message: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.' },
  ]);

  useEffect(() => {
    alerts.forEach((alert) => {
      Alert[alert.type || 'info'](alert.message);
    });
    setAlerts([]);
  }, [alerts]);

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
      const { data: { relog: { user } } } = await apolloClient.query({ query: queries.RELOG });
      console.log(user);
      setLoggedUser(user);
    } catch (error) {
      console.log('relog error', error.message);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  return (
    <UserContext.Provider value={{ loggedUser }}>
      <div className="App">
        <FormContext.Provider value={{ setToken, setLoggedUser }}>
          <NavBar logout={logout} />
        </FormContext.Provider>
        <Switch>
          <Route path="/" exact component={Home} />
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
