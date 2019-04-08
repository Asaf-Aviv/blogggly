import React from 'react';
import { string, arrayOf } from 'prop-types';
import { MessagePropTypes } from '../../propTypes';
import Message from '../Message';

const MessageBoard = ({ messages, loggedUserId }) => (
  <ul>
    {messages.map(message => (
      <Message
        loggedUserId={loggedUserId}
        key={message._id}
        message={message}
        fromOrTo={message.from._id === loggedUserId ? 'to' : 'from'}
      />
    ))}
  </ul>
);

MessageBoard.propTypes = {
  loggedUserId: string.isRequired,
  messages: arrayOf(MessagePropTypes).isRequired,
};

export default MessageBoard;
