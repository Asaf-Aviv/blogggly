
import React, { useContext, useState } from 'react';
import { UserContext } from '../../context';
import Container from '../Container';
import UserProfileMenu from '../UserProfileMenu';
import UserProfileInformation from '../UserProfileInformation';
import UserProfilePosts from '../UserProfilePosts';
import UserProfileComments from '../UserProfileComments';
import UserProfileFollows from '../UserProfileFollows';
import UserProfileLikes from '../UserProfileLikes';

import './CurrentUserProfile.sass';
import 'react-datepicker/dist/react-datepicker.css';

const CurrentUserProfile = () => {
  const [showCategory, setShowCategory] = useState('Information');

  const { loggedUser } = useContext(UserContext);

  const handleMenuClick = (e) => {
    const { category } = e.target.dataset;
    if (showCategory === category) return;

    setShowCategory(category);
  };

  if (!loggedUser) return null;

  console.log('showing', showCategory);

  return (
    <Container>
      <main className="user-profile">
        <h1>{loggedUser.username}</h1>
        <UserProfileMenu setCategory={handleMenuClick} />
        {showCategory === 'Information' && <UserProfileInformation userInfo={loggedUser.info} />}
        {showCategory === 'Posts' && <UserProfilePosts postIds={loggedUser.posts} />}
        {showCategory === 'Comments' && <UserProfileComments commentIds={loggedUser.comments} />}
        {showCategory === 'Followers' && <UserProfileFollows userIds={loggedUser.followers} />}
        {showCategory === 'Following' && <UserProfileFollows userIds={loggedUser.following} />}
        {showCategory === 'Likes' && <UserProfileLikes likes={loggedUser.likes} />}
        {showCategory === 'Settings' && <UserSettings />}
      </main>
    </Container>
  );
};

const UserSettings = () => <h1>UserSettings</h1>;
export default CurrentUserProfile;
