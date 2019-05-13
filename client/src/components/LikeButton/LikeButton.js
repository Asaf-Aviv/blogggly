import React, { useContext } from 'react';
import { Mutation } from 'react-apollo';
import Alert from 'react-s-alert';
import { bool, string } from 'prop-types';
import utils from '../../utils';
import queries from '../../graphql/queries';
import { UserContext, MemberFormsContext } from '../../context';

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
  const { setLoggedUser, isLogged } = useContext(UserContext);
  const { setShowLogin, setShowMemberForms } = useContext(MemberFormsContext);

  return (
    <Mutation
      mutation={queries.TOGGLE_LIKE}
      variables={{
        id: commentOrPostId,
        isPost,
      }}
      onError={utils.UIErrorNotifier}
      onCompleted={({ toggleLike }) => {
        const likeOnWhat = isPost ? 'posts' : 'comments';

        setLoggedUser((draft) => {
          draft.likes[likeOnWhat].includes(toggleLike._id)
            ? draft.likes[likeOnWhat].splice(
              draft.likes[likeOnWhat].indexOf(toggleLike._id), 1,
            )
            : draft.likes[likeOnWhat].unshift(toggleLike._id);
        });

        // loggedUser.likes[likeOnWhat].includes(toggleLike._id)
        //   ? setLoggedUser({
        //     ...loggedUser,
        //     likes: {
        //       ...loggedUser.likes,
        //       [likeOnWhat]: loggedUser.likes[likeOnWhat]
        //         .filter(likeId => likeId !== toggleLike._id),
        //     },
        //   })
        //   : setLoggedUser({
        //     ...loggedUser,
        //     likes: {
        //       ...loggedUser.likes,
        //       [likeOnWhat]: [
        //         toggleLike._id,
        //         ...loggedUser.likes[likeOnWhat],
        //       ],
        //     },
        //   });
      }}
    >
      {toggleLike => (
        <i
          className={`icon heart fa-heart ${loggedUserAlreadyLike ? 'fas' : 'far'}`}
          onClick={(e) => {
            if (!isLogged) {
              Alert.info(`Please login or signup to like this ${isPost ? 'post' : 'comment'}.`);
              setShowLogin(true);
              setShowMemberForms(true);
              return;
            }
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
