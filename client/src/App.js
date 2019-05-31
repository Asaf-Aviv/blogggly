import React, {
  useState, useEffect, useLayoutEffect, useRef,
} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Alert from 'react-s-alert';
import { hot } from 'react-hot-loader/root';
import { useImmer } from 'use-immer';
import apolloClient, { wsClient } from './ApolloClient';
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
import subscribeToCurrentUserUpdates from './graphql/helpers/subscribeToCurrentUserUpdates';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/jelly.css';
import './App.sass';

const App = () => {
  const [loggedUser, setLoggedUser] = useImmer(null);
  const [token, setToken] = useState(null);

  const [showMemberForms, setShowMemberForms] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  const currentUserSubscriptionRef = useRef();

  const toggleForms = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    if (loggedUser && !currentUserSubscriptionRef.current) {
      currentUserSubscriptionRef.current = subscribeToCurrentUserUpdates(
        setLoggedUser,
      );
    }
    if (!loggedUser && currentUserSubscriptionRef.current) {
      currentUserSubscriptionRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      currentUserSubscriptionRef.current = null;
      wsClient.close(false, false);
    }
  }, [loggedUser, setLoggedUser]);

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
    setLoggedUser(() => null);
    setToken(null);
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
        position="top-left"
        offset={60}
        stack={{ limit: 5 }}
        timeout={5000}
      />
    </>
  );
};

export default hot(App);
