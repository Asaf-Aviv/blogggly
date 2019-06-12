import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  shape, string, number, bool,
} from 'prop-types';
import UserAvatar from '../UserAvatar';
import UserActionsPanel from '../UserActionsPanel';
import ActionsDropDown from '../ActionsDropDown';

import './UserCard.sass';

const UserCard = ({
  user, following, friendRequestPending, isAFriend,
  isIncomingFriendRequest,
}) => (
  <div className="user-card">
    <ActionsDropDown resourceId={user._id} type="user" isAFriend={isAFriend} />
    <header className="user-card__header">
      <UserAvatar avatar={user.avatar} username={user.username} />
      <Link className="user-card__link" to={`/user/${user.username}`}>
        <h3>{user.username}</h3>
      </Link>
    </header>
    <div className="user-card__info">
      {user.info.firstname && (
        <>
          <span className="user-card__name">
            {`${user.info.firstname} ${user.info.lastname}`}
          </span>
          <span className="user-card__country">{user.info.country}</span>
        </>
      )}
      <p className="user-card__bio">{user.info.bio}</p>
    </div>
    <div className="user-card__follows-container">
      <div className="user-card__follows">
        <span className="user-card__follows-count">{user.followingCount}</span>
        <span>Following</span>
      </div>
      <div className="user-card__follows">
        <span className="user-card__follows-count">{user.followersCount}</span>
        <span>Followers</span>
      </div>
    </div>
    <UserActionsPanel
      following={following}
      userId={user._id}
      username={user.username}
      isIncomingFriendRequest={isIncomingFriendRequest}
      friendRequestPending={friendRequestPending}
      isAFriend={isAFriend}
    />
    <span className="user-card__member-since">{`Member since ${moment(+user.createdAt).format('LL')}`}</span>
  </div>
);


UserCard.propTypes = {
  user: shape({
    _id: string.isRequired,
    username: string.isRequired,
    avatar: string.isRequired,
    createdAt: string.isRequired,
    followersCount: number.isRequired,
    followingCount: number.isRequired,
    info: shape({
      firstname: string.isRequired,
      lastname: string.isRequired,
      bio: string.isRequired,
      country: string.isRequired,
    }).isRequired,
  }).isRequired,
  following: bool.isRequired,
  friendRequestPending: bool.isRequired,
  isAFriend: bool.isRequired,
  isIncomingFriendRequest: bool.isRequired,
};

export default UserCard;
