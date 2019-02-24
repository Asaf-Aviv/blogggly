import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import { number, string, arrayOf } from 'prop-types';
import { UserContext } from '../../context';
import { UIErrorNotifier } from '../../utils';
import queries from '../../graphql/queries';

const Likes = ({ likeCount, postId, likes }) => {
  const { loggedUser } = useContext(UserContext);

  let likePostText;
  const loggedUserLikePost = loggedUser && likes.includes(loggedUser._id);

  if (loggedUser && loggedUserLikePost) {
    const numberOfLikesWithoutUser = likeCount - 1;
    likePostText = numberOfLikesWithoutUser
      ? `You and ${numberOfLikesWithoutUser} ${numberOfLikesWithoutUser > 1 ? 'others' : 'person'} like this`
      : 'You like this';
  }

  return (
    <Mutation
      mutation={queries.TOGGLE_LIKE}
      variables={{ postId, userId: loggedUser && loggedUser._id }}
      refetchQueries={[{ query: queries.POST, variables: { postId } }]}
      onError={UIErrorNotifier}
    >
      {(toggleLike, { loading }) => (
        <div className="likes__container">
          <i
            className={`heart fa-heart ${loggedUserLikePost ? 'fas' : 'far'}`}
            onClick={loading ? null : toggleLike}
          />
          {likeCount > 0 && (
          <span className="like-count">
            {likePostText || `${likeCount} ${likeCount > 1 ? 'People' : 'Person'} like this`}
          </span>
          )}
        </div>
      )}
    </Mutation>
  );
};

Likes.propTypes = {
  likeCount: number.isRequired,
  postId: string.isRequired,
  likes: arrayOf(string).isRequired,
};

export default Likes;
