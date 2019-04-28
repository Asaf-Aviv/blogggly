
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
    <main className="user-profile">
      <Container>
        <UserProfileNav />
        <Switch>
          <Route path={`${path}/information`} render={() => <UserProfileInformation userInfo={loggedUser.info} />} />
          <Route path={`${path}/posts`} render={() => <UserProfilePosts postIds={loggedUser.posts} />} />
          <Route path={`${path}/comments`} render={() => <UserProfileComments commentIds={loggedUser.comments} />} />
          <Route path={`${path}/followers`} render={() => <UserProfileFollows userIds={loggedUser.followers} />} />
          <Route path={`${path}/following`} render={() => <UserProfileFollows userIds={loggedUser.following} />} />
          <Route path={`${path}/friends`} render={() => <UserProfileFriends userIds={loggedUser.friends} />} />
          <Route path={`${path}/likes`} render={() => <UserProfileLikes likes={loggedUser.likes} />} />
          <Route path={`${path}/settings`} render={() => <UserSettings />} />
          <Route path={path} render={() => <Redirect to={`${path}/information`} />} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Container>
    </main>
  );
};

CurrentUserProfile.propTypes = {
  match: shape({
    path: string.isRequired,
  }).isRequired,
};

const UserSettings = () => <h1>UserSettings</h1>;

export default CurrentUserProfile;
