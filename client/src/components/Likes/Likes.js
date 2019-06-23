import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import {
  number, string, arrayOf, bool,
} from 'prop-types';
import { UserContext } from '../../context';
import UsersDetailsDropdown from '../UsersDetailsDropdown';
import LikeButton from '../LikeButton/LikeButton';

import './Likes.sass';

const Likes = ({
  likesCount, id: commentOrPostId, likes, isPost,
}) => {
  const [showLikesDropdown, setShowLikesDropdown] = useState(false);

  const { loggedUser } = useContext(UserContext);

  const userDropdownContainerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (userDropdownContainerRef.current
      && !userDropdownContainerRef.current.contains(event.target)
    ) {
      setShowLikesDropdown(false);
    }
  };

  useEffect(() => {
    const eventType = 'touchstart' in window ? 'touchstart' : 'click';

    document.addEventListener(eventType, handleClickOutside, true);
    return () => {
      document.removeEventListener(eventType, handleClickOutside, true);
    };
  });

  let likeText;
  const loggedUserAlreadyLike = !!loggedUser && likes.includes(loggedUser._id);

  if (loggedUser && loggedUserAlreadyLike) {
    const numberOfLikesWithoutUser = likesCount - 1;
    likeText = numberOfLikesWithoutUser
      ? `You and ${numberOfLikesWithoutUser} ${numberOfLikesWithoutUser > 1 ? 'others' : 'person'} like this`
      : 'You like this';
  }

  return (
    <div className="likes__container">
      <LikeButton
        commentOrPostId={commentOrPostId}
        loggedUserAlreadyLike={loggedUserAlreadyLike}
        isPost={isPost}
      />
      {likesCount > 0 && (
        <div
          ref={userDropdownContainerRef}
          className="like-count__container"
          onClick={() => setShowLikesDropdown(!showLikesDropdown)}
        >
          <span>
            {likeText || `${likesCount} ${likesCount > 1 ? 'People' : 'Person'} like this`}
          </span>
          {showLikesDropdown && (
            <UsersDetailsDropdown userIds={likes} />
          )}
        </div>
      )}
    </div>
  );
};

Likes.propTypes = {
  likesCount: number.isRequired,
  id: string.isRequired,
  likes: arrayOf(string).isRequired,
  isPost: bool,
};

Likes.defaultProps = {
  isPost: false,
};

export default Likes;
