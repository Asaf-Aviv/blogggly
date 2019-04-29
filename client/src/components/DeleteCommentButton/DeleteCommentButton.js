import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { string, func } from 'prop-types';
import Alert from 'react-s-alert';
import ConfirmationModal from '../ConfirmationModal';
import queries from '../../graphql/queries';

const DeleteCommentButton = ({ commentId, postId, onCompletedCb }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const changeModalState = nextState => () => (
    setShowConfirmationModal(nextState || !showConfirmationModal)
  );

  return (
    <Mutation
      mutation={queries.DELETE_COMMENT}
      variables={{ commentId, postId }}
      onCompleted={({ deleteComment: deletedCommentId }) => {
        Alert.success('Comment deleted successfully.');
        setShowConfirmationModal(false);
        if (onCompletedCb) {
          onCompletedCb(deletedCommentId);
        }
      }}
    >
      {deleteComment => (
        <>
          <button
            type="button"
            className="trash-btn"
            onClick={changeModalState(true)}
          >
            <i className="fas fa-trash" />
          </button>
          {showConfirmationModal && (
            <ConfirmationModal
              confirmationQuestion="Are you sure you want to delete this comment?"
              onConfirm={deleteComment}
              onCancel={changeModalState(false)}
              theme="danger"
            />
          )}
        </>
      )}
    </Mutation>
  );
};

DeleteCommentButton.propTypes = {
  commentId: string.isRequired,
  postId: string.isRequired,
  onCompletedCb: func,
};

DeleteCommentButton.defaultProps = {
  onCompletedCb: null,
};

export default DeleteCommentButton;