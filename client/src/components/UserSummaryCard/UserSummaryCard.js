import React, { useContext, useState } from 'react';
import { shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import moment from 'moment';
import UserAvatar from '../UserAvatar';
import FollowButton from '../FollowButton';
import { UserContext } from '../../context';
import SendMessageModal from '../SendMessageModal';

import './UserSummaryCard.sass';

const UserSummaryCard = ({ user }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const { loggedUser } = useContext(UserContext);

  return (
    <div className="user-card">
      <div className="user-card__header">
        <UserAvatar avatar={user.avatar} username={user.username} />
      </div>
      <Link className="user-card__link" to={`/user/${user.username}`}>
        <span className="user-card__username">{user.username}</span>
      </Link>
      <div className="user-card__actions">
        <FollowButton
          userId={user._id}
          following={loggedUser.following.includes(user._id)}
        />
        <button
          type="button"
          className="btn btn--success btn--sm"
          onClick={() => setShowMessageModal(true)}
        >
          Send Message
        </button>
      </div>
      <p className="user-card__bio">{user.info.bio}</p>
      <p className="user-card__member-since">
        {`Member since ${moment(+user.createdAt).format('LL')}`}
      </p>
      {showMessageModal && (
        <SendMessageModal
          userId={user._id}
          username={user.username}
          closeModal={() => setShowMessageModal(false)}
        />
      )}
    </div>
  );
};

UserSummaryCard.propTypes = {
  user: shape({
    _id: string.isRequired,
    username: string.isRequired,
    avatar: string.isRequired,
    createdAt: string.isRequired,
    info: shape({
      bio: string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default UserSummaryCard;
