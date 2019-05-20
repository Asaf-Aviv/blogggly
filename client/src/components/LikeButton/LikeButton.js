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
      mutation={isPost ? queries.TOGGLE_LIKE_ON_POST : queries.TOGGLE_LIKE_ON_COMMENT}
      variables={{ [isPost ? 'postId' : 'commentId']: commentOrPostId }}
      onError={utils.UIErrorNotifier}
      onCompleted={(data) => {
        console.log(data);
        const like = data[isPost ? 'toggleLikeOnPost' : 'toggleLikeOnComment'];
        const likeOnWhat = isPost ? 'posts' : 'comments';

        setLoggedUser((draft) => {
          draft.likes[likeOnWhat].includes(like._id)
            ? draft.likes[likeOnWhat].splice(
              draft.likes[likeOnWhat].indexOf(like._id), 1,
            )
            : draft.likes[likeOnWhat].unshift(like._id);
        });
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
