import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import Alert from 'react-s-alert';
import { string, func } from 'prop-types';
import queries from '../../graphql/queries';
import { UserContext } from '../../context';
import ConfirmationModal from '../ConfirmationModal';
import Button from '../Button';

const DeletePostButton = ({ postId, onCompletedCb }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { setLoggedUser } = useContext(UserContext);

  const changeModalState = nextState => () => (
    setShowConfirmationModal(nextState || !showConfirmationModal)
  );

  return (
    <Mutation
      mutation={queries.DELETE_POST}
      variables={{ postId }}
      onCompleted={({ deletePost: deletedPostId }) => {
        setLoggedUser((loggedUser) => {
          loggedUser.posts.splice(
            loggedUser.posts.indexOf(deletedPostId), 1,
          );
        });
        Alert.success('Post deleted successfully.');
        setShowConfirmationModal(false);
        if (onCompletedCb) {
          onCompletedCb(deletedPostId);
        }
      }}
    >
      {deletePost => (
        <>
          <Button
            classes="trash-btn"
            onClick={changeModalState(true)}
          >
            <i className="fas fa-trash" />
          </Button>
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
