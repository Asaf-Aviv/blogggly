
import React, { useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { UserContext } from '../../context';
import Container from '../Container';
import UserProfileNav from '../UserProfileNav';
import UserProfileInformation from '../UserProfileInformation';
import UserProfilePosts from '../UserProfilePosts';
import UserProfileComments from '../UserProfileComments';
import UserProfileFriends from '../UserProfileFriends';
import UserProfileFollows from '../UserProfileFollows';
import UserProfileLikes from '../UserProfileLikes';

import './CurrentUserProfile.sass';

const CurrentUserProfile = ({ match: { path } }) => {
  const { loggedUser } = useContext(UserContext);

  if (!loggedUser) return null;

  return (
    <div className="user-profile">
      <Container>
        <UserProfileNav />
        <Switch>
          <Route exact path={`${path}/information`} render={() => <UserProfileInformation userInfo={loggedUser.info} />} />
          <Route exact path={`${path}/posts`} render={() => <UserProfilePosts postIds={loggedUser.posts} />} />
          <Route exact path={`${path}/comments`} render={() => <UserProfileComments commentIds={loggedUser.comments} />} />
          <Route exact path={`${path}/followers`} render={() => <UserProfileFollows userIds={loggedUser.followers} followers />} />
          <Route exact path={`${path}/following`} render={() => <UserProfileFollows userIds={loggedUser.following} />} />
          <Route exact path={`${path}/friends`} render={() => <UserProfileFriends userIds={loggedUser.friends} />} />
          <Route exact path={`${path}/likes`} render={() => <UserProfileLikes likes={loggedUser.likes} />} />
          <Route exact path={`${path}/settings`} render={() => <UserSettings />} />
          <Route exact path={path} render={() => <Redirect to={`${path}/information`} />} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Container>
    </div>
  );
};

CurrentUserProfile.propTypes = {
  match: shape({
    path: string.isRequired,
  }).isRequired,
};

const UserSettings = () => <h1>UserSettings</h1>;

export default CurrentUserProfile;
