import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import apolloClient from './ApolloClient';
import NavBar from './components/NavBar';
import Users from './components/Users';
import Home from './components/Home';
import { UserContext, FormContext } from './context';
import queries from './graphql/queries';

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
          <Route render={() => <Redirect to="/" />} />
        </Switch>
        {/* {!token && <Login setLoggedUser={setLoggedUser} setToken={setToken} />} */}
        {/* <SignUp setLoggedUser={setLoggedUser} setToken={setToken} /> */}
        {/* {!loggedUser && <MemberForms />} */}
      </div>
    </UserContext.Provider>
  );
};


export default App;
