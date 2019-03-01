import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import {
  number, string, arrayOf, bool,
} from 'prop-types';
import { UserContext } from '../../context';
import utils from '../../utils';
import queries from '../../graphql/queries';

const Likes = ({
  likeCount, id, likes, isPost,
}) => {
  const { loggedUser, setLoggedUser } = useContext(UserContext);

  let likeText;
  const loggedUserAlreadyLike = loggedUser && likes.includes(loggedUser._id);

  if (loggedUser && loggedUserAlreadyLike) {
    const numberOfLikesWithoutUser = likeCount - 1;
    likeText = numberOfLikesWithoutUser
      ? `You and ${numberOfLikesWithoutUser} ${numberOfLikesWithoutUser > 1 ? 'others' : 'person'} like this`
      : 'You like this';
  }

  return (
    <Mutation
      mutation={queries.TOGGLE_LIKE}
      variables={{ id, userId: loggedUser && loggedUser._id, isPost }}
      onError={utils.UIErrorNotifier}
      onCompleted={({ toggleLike }) => {
        const likeOnWhat = toggleLike.__typename === 'Post' ? 'posts' : 'comments';

        console.log(likeOnWhat);

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
      {(toggleLike, { loading }) => (
        <div className="likes__container">
          <i
            className={`heart fa-heart ${loggedUserAlreadyLike ? 'fas' : 'far'}`}
            onClick={loading ? null : toggleLike}
          />
          {likeCount > 0 && (
          <span className="like-count">
            {likeText || `${likeCount} ${likeCount > 1 ? 'People' : 'Person'} like this`}
          </span>
          )}
        </div>
      )}
    </Mutation>
  );
};

Likes.propTypes = {
  likeCount: number.isRequired,
  id: string.isRequired,
  likes: arrayOf(string).isRequired,
  isPost: bool,
};

Likes.defaultProps = {
  isPost: false,
};

export default Likes;
