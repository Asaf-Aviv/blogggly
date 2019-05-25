import React, { useState, useContext } from 'react';
import { string, oneOf } from 'prop-types';
import moment from 'moment';
import { Mutation } from 'react-apollo';
import Alert from 'react-s-alert';
import { MessagePropTypes } from '../../propTypes';
import utils from '../../utils';
import queries from '../../graphql/queries';
import SendMessageModal from '../SendMessageModal';
import MessageModal from '../MessageModal';
import ConfirmationModal from '../ConfirmationModal';
import { UserContext } from '../../context';
import ReportModal from '../ReportModal';

import './Message.sass';

let deleteFunc;

const Message = ({ message, fromOrTo, loggedUserId }) => {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { setLoggedUser } = useContext(UserContext);

  const updateLoggedUserInbox = (sentOrReceived, updatedMessage) => {
    setLoggedUser((draft) => {
      const messagesArray = draft.inbox[sentOrReceived];
      messagesArray.splice(
        messagesArray.fineIndex(msg => msg._id === updatedMessage._id, 1, updatedMessage),
      );
    });
  };

  return (
    <li key={message._id} className="message__container">
      <div className="message__wrapper" onClick={() => setShowMessageModal(true)}>
        <span className="message__from">{message[fromOrTo].username}</span>
        <span className="message__date">{moment(+message.createdAt).startOf('seconds').fromNow()}</span>
        <p className="message__body">{message.body}</p>
      </div>
      <div className="message__actions">
        <Mutation
          mutation={queries.BOOKMARK_MESSAGE}
          variables={{ messageId: message._id }}
          onCompleted={({ bookmarkMessage }) => {
            const sentOrReceived = fromOrTo === 'to' ? 'sent' : 'inbox';
            updateLoggedUserInbox(sentOrReceived, bookmarkMessage);
          }}
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
          onCompleted={({ moveMessageToTrash }) => {
            const sentOrReceived = fromOrTo === 'to' ? 'sent' : 'inbox';
            updateLoggedUserInbox(sentOrReceived, moveMessageToTrash);
          }}
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
            onCompleted={({ deleteMessageId }) => {
              const sentOrReceived = fromOrTo === 'to' ? 'sent' : 'inbox';
              setLoggedUser((draft) => {
                const messagesArray = draft.inbox[sentOrReceived];
                messagesArray.splice(
                  messagesArray.indexOf(msg => msg._id !== deleteMessageId), 1,
                );
              });
              Alert.success('Message deleted successfully');
              setShowConfirmationModal(false);
            }}
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
          <>
            <button className="message__btn" type="button" onClick={() => setShowReplyModal(true)}>
              <i className="fas fa-reply" />
            </button>
            <button className="message__btn message__report-btn" type="button" onClick={() => setShowReportModal(true)}>
              <i className="fas fa-flag" />
            </button>
            {showReportModal && (
            <ReportModal
              reportedId={message._id}
              type="message"
              closeModal={() => setShowReportModal(false)}
            />
            )}
          </>
        )}
      </div>
      {showReplyModal && (
        <SendMessageModal
          userId={message.from._id}
          username={message.from.username}
          closeModal={() => setShowReplyModal(false)}
        />
      )}
      {showMessageModal && (
        <MessageModal message={message} closeModal={() => setShowMessageModal(false)} />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          onConfirm={deleteFunc}
          onCancel={() => setShowConfirmationModal(false)}
          onConfirmText="Delete"
          confirmationQuestion="Are you sure you want to delete this message?"
          theme="danger"
        />
      )}
    </li>
  );
};

Message.propTypes = {
  message: MessagePropTypes.isRequired,
  fromOrTo: oneOf(['from', 'to']).isRequired,
  loggedUserId: string.isRequired,
};

export default Message;
