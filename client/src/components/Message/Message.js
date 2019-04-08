import React, { useState } from 'react';
import { string, oneOf } from 'prop-types';
import moment from 'moment';
import { Mutation } from 'react-apollo';
import { MessagePropTypes } from '../../propTypes';
import utils from '../../utils';
import queries from '../../graphql/queries';
import SendMessageModal from '../SendMessageModal';

import './Message.sass';

const Message = ({ message, fromOrTo, loggedUserId }) => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  let deleteFunc;

  return (
    <li key={message._id} className="message__container">
      <div className="message__wrapper" onClick={() => setShowFullMessage(true)}>
        <span className="message__from">{message[fromOrTo].username}</span>
        <span className="message__body">{message.body}</span>
        <span className="message__date">{moment(+message.createdAt).startOf('seconds').fromNow()}</span>
      </div>
      <div className="message__actions">
        <Mutation
          mutation={queries.BOOKMARK_MESSAGE}
          variables={{ messageId: message._id }}
          onError={utils.UIErrorNotifier}
        >
          {bookmarkMessage => (
            <button className="message__btn" type="button" onClick={bookmarkMessage}>
              <i className={`${message.inBookmarks ? 'fas' : 'far'} fa-bookmark`} />
            </button>
          )}
        </Mutation>
        <Mutation
          mutation={queries.MOVE_MESSAGE_TO_TRASH}
          variables={{ messageId: message._id }}
          onError={utils.UIErrorNotifier}
        >
          {moveToTrash => (
            <button className="message__btn" type="button" onClick={moveToTrash}>
              {message.inTrash
                ? 'Restore'
                : <i className="fas fa-trash" />
              }
            </button>
          )}
        </Mutation>
        {message.inTrash && (
          <Mutation
            mutation={queries.DELETE_MESSAGE}
            variables={{ messageId: message._id }}
            onError={utils.UIErrorNotifier}
          >
            {deleteMessage => (
              <button
                className="message__btn"
                type="button"
                onClick={() => {
                  if (message.inTrash) {
                    deleteFunc = deleteMessage;
                    setShowConfirmationModal(true);
                    return;
                  }
                  deleteMessage();
                }}
              >
                <i className="fas fa-trash" />
              </button>
            )}
          </Mutation>
        )}
        {message.from._id !== loggedUserId && (
          <button className="message__btn" type="button" onClick={() => setShowReplyModal(true)}>
            <i className="fas fa-reply" />
          </button>
        )}
      </div>
      {showReplyModal && (
        <SendMessageModal
          userId={message.from._id}
          username={message.from.username}
          closeModal={() => setShowReplyModal(false)}
        />
      )}
      {showFullMessage && (
        <FullMessageModal message={message} />
      )}
      {showConfirmationModal && (
        <h1>showing confirmation</h1>
      )}
    </li>
  );
};

const FullMessageModal = ({ message }) => (
  <h1>fullMessageModal</h1>
);

Message.propTypes = {
  message: MessagePropTypes.isRequired,
  fromOrTo: oneOf(['from', 'to']).isRequired,
  loggedUserId: string.isRequired,
};

export default Message;
