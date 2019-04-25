
import React, { useContext } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { shape, string } from 'prop-types';
import { UserContext } from '../../context';
import Container from '../Container';
import UserProfileNav from '../UserProfileNav';
import UserProfileInformation from '../UserProfileInformation';
import UserProfilePosts from '../UserProfilePosts';
import UserProfileComments from '../UserProfileComments';
import UserProfileFollows from '../UserProfileFollows';
import UserProfileLikes from '../UserProfileLikes';

import './CurrentUserProfile.sass';

const CurrentUserProfile = ({ match }) => {
  const { loggedUser } = useContext(UserContext);

  if (!loggedUser) return null;

  return (
    <main className="user-profile">
      <Container>
        <UserProfileNav />
        <Switch>
          <Route exact path={`${match.path}/information`} render={() => <UserProfileInformation userInfo={loggedUser.info} />} />
          <Route exact path={`${match.path}/posts`} render={() => <UserProfilePosts postIds={loggedUser.posts} />} />
          <Route exact path={`${match.path}/comments`} render={() => <UserProfileComments commentIds={loggedUser.comments} />} />
          <Route exact path={`${match.path}/followers`} render={() => <UserProfileFollows userIds={loggedUser.followers} />} />
          <Route exact path={`${match.path}/following`} render={() => <UserProfileFollows userIds={loggedUser.following} />} />
          <Route exact path={`${match.path}/likes`} render={() => <UserProfileLikes likes={loggedUser.likes} />} />
          <Route exact path={`${match.path}/settings`} render={() => <UserSettings />} />
          <Route exact path={match.path} render={() => <Redirect to={`${match.path}/information`} />} />
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
