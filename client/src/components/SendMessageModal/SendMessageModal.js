import React, { useState, useContext } from 'react';
import { Mutation } from 'react-apollo';
import { string, func } from 'prop-types';
import Alert from 'react-s-alert';
import queries from '../../graphql/queries';
import Input from '../Input';
import Label from '../Label';
import { UserContext } from '../../context';

import './SendMessageModal.sass';

const SendMessageModal = ({ userId, username, closeModal }) => {
  const [body, setBody] = useState('');

  const { setLoggedUser } = useContext(UserContext);

  return (
    <Mutation
      mutation={queries.SEND_MESSAGE}
      variables={{ to: userId, body }}
      onCompleted={({ sendMessage: message }) => {
        Alert.success('Message sent successfully');
        setLoggedUser(loggedUser => ({
          ...loggedUser,
          inbox: {
            ...loggedUser.inbox,
            sent: [message, ...loggedUser.inbox.sent],
          },
        }));
        closeModal();
      }}
    >
      {sendMessage => (
        <div className="send-message__modal" onClick={closeModal}>
          <div className="send-message__container" onClick={e => e.stopPropagation()}>
            <form
              className="send-message__form"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
            >
              <button
                className="send-message__close-btn"
                type="button"
                onClick={closeModal}
              >
                <i className="fas fa-times" />
              </button>
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
              <button className="btn btn--primary reply-message__submit-btn" type="submit">Send</button>
            </form>
          </div>
        </div>
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
