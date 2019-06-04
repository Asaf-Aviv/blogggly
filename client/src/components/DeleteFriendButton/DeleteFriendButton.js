import React, { useState, useContext } from 'react';
import Alert from 'react-s-alert';
import { Mutation } from 'react-apollo';
import { string } from 'prop-types';
import queries from '../../graphql/queries';
import { UserContext } from '../../context';
import ConfirmationModal from '../ConfirmationModal';
import Button from '../Button';

const RemoveFriendButton = ({ userId }) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const { setLoggedUser } = useContext(UserContext);

  const changeModalState = nextState => () => (
    setShowConfirmationModal(nextState || !showConfirmationModal)
  );

  return (
    <Mutation
      mutation={queries.REMOVE_FRIEND}
      variables={{ userId }}
      onCompleted={() => {
        setLoggedUser((loggedUser) => {
          loggedUser.friends.splice(
            loggedUser.friends.indexOf(userId), 1,
          );
        });
        Alert.success('Friend removed successfully.');
        setShowConfirmationModal(false);
      }}
    >
      {removeFriend => (
        <>
          <Button
            classes="actions-dropdown__btn"
            onClick={changeModalState(true)}
            text="Unfriend"
          />
          {showConfirmationModal && (
            <ConfirmationModal
              confirmationQuestion="Are you sure you want to remove this friend?"
              onConfirm={removeFriend}
              onCancel={changeModalState(false)}
              theme="danger"
            />
          )}
        </>
      )}
    </Mutation>
  );
};

RemoveFriendButton.propTypes = {
  userId: string.isRequired,
};

export default RemoveFriendButton;
