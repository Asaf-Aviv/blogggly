import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import Alert from 'react-s-alert';
import { string, func } from 'prop-types';
import queries from '../../graphql/queries';
import ConfirmationModal from '../ConfirmationModal';

const DeletePostButton = ({ postId, onCompletedCb }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const changeModalState = nextState => () => (
    setShowConfirmationModal(nextState || !showConfirmationModal)
  );

  return (
    <Mutation
      mutation={queries.DELETE_POST}
      variables={{ postId }}
      onCompleted={({ deletePost: deletedPostId }) => {
        Alert.success('Post deleted successfully.');
        setShowConfirmationModal(false);
        if (onCompletedCb) {
          onCompletedCb(deletedPostId);
        }
      }}
    >
      {deletePost => (
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
              confirmationQuestion="Are you sure you want to delete this post?"
              onConfirm={deletePost}
              onCancel={changeModalState(false)}
              theme="danger"
            />
          )}
        </>
      )}
    </Mutation>
  );
};

DeletePostButton.propTypes = {
  postId: string.isRequired,
  onCompletedCb: func,
};

DeletePostButton.defaultProps = {
  onCompletedCb: null,
};

export default DeletePostButton;
