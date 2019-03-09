import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import { bool, string } from 'prop-types';
import utils from '../../utils';
import queries from '../../graphql/queries';
import { UserContext } from '../../context';

const toggleHeartClass = (e) => {
  if (e.target.classList.contains('fas')) {
    e.target.classList.remove('fas');
    e.target.classList.add('far');
    return;
  }
  e.target.classList.remove('far');
  e.target.classList.add('fas');
};

const LikeButton = ({ commentOrPostId, isPost, loggedUserAlreadyLike }) => {
  const { loggedUser, setLoggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.TOGGLE_LIKE}
      variables={{
        id: commentOrPostId,
        userId: loggedUser && loggedUser._id,
        isPost,
      }}
      onError={utils.UIErrorNotifier}
      onCompleted={({ toggleLike }) => {
        const likeOnWhat = toggleLike.__typename === 'Post' ? 'posts' : 'comments';

        loggedUser.likes[likeOnWhat].includes(toggleLike._id)
          ? setLoggedUser({
            ...loggedUser,
            likes: {
              ...loggedUser.likes,
              [likeOnWhat]: loggedUser.likes[likeOnWhat]
                .filter(likeId => likeId !== toggleLike._id),
            },
          })
          : setLoggedUser({
            ...loggedUser,
            likes: {
              ...loggedUser.likes,
              [likeOnWhat]: [
                toggleLike._id,
                ...loggedUser.likes[likeOnWhat],
              ],
            },
          });
      }}
    >
      {toggleLike => (
        <i
          className={`icon heart fa-heart ${loggedUserAlreadyLike ? 'fas' : 'far'}`}
          onClick={(e) => {
            if (!loggedUser) return;
            toggleLike();
            toggleHeartClass(e);
          }}
        />
      )}
    </Mutation>
  );
};

LikeButton.propTypes = {
  commentOrPostId: string.isRequired,
  isPost: bool.isRequired,
  loggedUserAlreadyLike: bool.isRequired,
};

export default LikeButton;
