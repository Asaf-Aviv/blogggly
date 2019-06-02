import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { string, func } from 'prop-types';
import Alert from 'react-s-alert';
import queries from '../../graphql/queries';
import Input from '../Input';
import Label from '../Label';
import TransparentModal from '../TransparentModal';
import { UserContext } from '../../context';
import Button from '../Button';

import './SendMessageModal.sass';

const SendMessageModal = ({ userId, username, closeModal }) => {
  const [body, setBody] = useState('');

  const { setLoggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.SEND_MESSAGE}
      variables={{ to: userId, body }}
      onCompleted={({ sendMessage: message }) => {
        setLoggedUser((draft) => {
          draft.inbox.sent.unshift(message);
        });
        Alert.success('Message sent successfully');
        closeModal();
      }}
    >
      {sendMessage => (
        <TransparentModal onBackgroundClick={closeModal}>
          <form
            onClick={e => e.stopPropagation()}
            className="send-message__form"
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
          >
            <Button
              classes="send-message__close-btn"
              onClick={closeModal}
            >
              <i className="fas fa-times" />
            </Button>
            <Label labelFor="to" classes="send-message__label">
              <Input
                value={username}
                disabled
              />
            </Label>
            <Label labelFor="message" classes="send-message__label">
              <textarea
                placeholder="Message"
                className="send-message__textarea"
                value={body}
                onChange={e => setBody(e.target.value)}
              />
            </Label>
            <Button type="submit" className="btn btn--primary reply-message__submit-btn" text="Send" />
          </form>
        </TransparentModal>
      )}
    </Mutation>
  );
};

SendMessageModal.propTypes = {
  username: string.isRequired,
  userId: string.isRequired,
  closeModal: func.isRequired,
};

export default SendMessageModal;
