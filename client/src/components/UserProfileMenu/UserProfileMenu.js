import React from 'react';
import { func } from 'prop-types';

const UserProfileMenu = ({ setCategory }) => (
  <nav className="user-profile__sidebar">
    <ul className="user-profile__menu" onClick={setCategory}>
      <li className="user-profile__menu-item" data-category="Information">Information</li>
      <li className="user-profile__menu-item" data-category="Posts">Posts</li>
      <li className="user-profile__menu-item" data-category="Comments">Comments</li>
      <li className="user-profile__menu-item" data-category="Followers">Followers</li>
      <li className="user-profile__menu-item" data-category="Following">Following</li>
      <li className="user-profile__menu-item" data-category="Likes">Likes</li>
      <li className="user-profile__menu-item" data-category="Settings">Settings</li>
      <li className="user-profile__menu-item" data-category="Logout">Logout</li>
    </ul>
  </nav>
);

UserProfileMenu.propTypes = {
  setCategory: func.isRequired,
};

export default UserProfileMenu;
