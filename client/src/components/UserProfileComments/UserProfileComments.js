import React, { useState, useContext } from 'react';
import { Query, Mutation } from 'react-apollo';
import { Link } from 'react-router-dom';
import {
  arrayOf, string, number, shape,
} from 'prop-types';
import Alert from 'react-s-alert';
import queries from '../../graphql/queries';
import utils from '../../utils';
import { UserShortSummaryPropTypes } from '../../propTypes';
import Likes from '../Likes';
import ConfirmationModal from '../ConfirmationModal';
import { UserContext } from '../../context';

import './UserProfileComment.sass';

const UserProfileComment = ({ comment, comment: { post } }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { loggedUser, setLoggedUser } = useContext(UserContext);

  return (
    <div className="user-profile-comment__container">
      <Link to={`/post/${post._id}`}>
        <h5 className="user-profile-comment__post-title">
          {`on ${post.author.username} post ${post.title}`}
        </h5>
      </Link>
      <p className="user-profile-comment__comment-body">{comment.body}</p>
      <div className="likes__wrapper">
        <Likes
          id={comment._id}
          likesCount={comment.likesCount}
          likes={comment.likes}
        />
        <Mutation
          mutation={queries.DELETE_COMMENT}
          variables={{ commentId: comment._id, postId: post._id }}
          onCompleted={({ deleteComment: deletedCommentId }) => {
            const updatedComments = loggedUser.comments
              .filter(commentId => commentId !== deletedCommentId);

            setLoggedUser({
              ...loggedUser,
              comments: updatedComments,
              likes: {
                ...loggedUser.likes,
                comments: loggedUser.likes.comments.filter(cId => cId !== comment._id),
              },
            });
          }}
        >
          {deleteComment => (
            <>
              <button
                type="button"
                className="trash-btn"
                onClick={() => setShowConfirmationModal(true)}
              >
                <i className="fas fa-trash" />
              </button>
              {showConfirmationModal && (
                <ConfirmationModal
                  confirmationQuestion="Are you sure you want to delete this comment?"
                  onConfirm={async () => {
                    await deleteComment();
                    setShowConfirmationModal(false);
                    Alert.success('Comment deleted successfully.');
                  }}
                  onCancel={() => setShowConfirmationModal(false)}
                  theme="danger"
                />
              )}
            </>
          )}
        </Mutation>
      </div>
    </div>
  );
};

UserProfileComment.propTypes = {
  comment: shape({
    _id: string.isRequired,
    body: string.isRequired,
    createdAt: string.isRequired,
    likes: arrayOf(string).isRequired,
    likesCount: number.isRequired,
    post: shape({
      _id: string.isRequired,
      title: string.isRequired,
      author: UserShortSummaryPropTypes.isRequired,
    }).isRequired,
  }).isRequired,
};

const UserProfileComments = ({ commentIds }) => (
  <Query
    query={queries.GET_COMMENTS_BY_IDS}
    onError={utils.UIErrorNotifier}
    variables={{ commentIds, withPostInfo: true }}
  >
    {({ data, loading }) => {
      if (loading) return null;

      return (
        <div>
          {data.comments.map(comment => (
            <UserProfileComment key={comment._id} comment={comment} />
          ))}
        </div>
      );
    }}
  </Query>
);

UserProfileComments.propTypes = {
  commentIds: arrayOf(string).isRequired,
};

export default UserProfileComments;
