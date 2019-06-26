import React, { useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';
import Users from '../Users';
import Home from '../Home';
import PostEditor from '../PostEditor';
import Posts from '../Posts';
import Post from '../Post';
import PostsByTag from '../PostsByTag';
import Inbox from '../Inbox';
import Forgot from '../Forgot';
import ResetPassword from '../ResetPassword';
import UserProfile from '../UserProfile';
import CurrentUserProfile from '../CurrentUserProfile';

const Routes = () => {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname);
  }, []);

  return (
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
  );
};

export default Routes;
