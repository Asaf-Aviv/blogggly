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
import Button from '../Button';

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
        messagesArray.findIndex(msg => msg._id === updatedMessage._id), 1, updatedMessage,
      );
    });
  };

  const inInbox = (fromOrTo === 'from');
  const sentOrReceived = inInbox;

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
          variables={{ messageId: message._id, inInbox }}
          onCompleted={({ bookmarkMessage }) => {
            console.log(bookmarkMessage);
            updateLoggedUserInbox(inInbox, bookmarkMessage);
          }}
          onError={utils.UIErrorNotifier}
        >
          {bookmarkMessage => (
            <Button classes="message__btn" onClick={bookmarkMessage}>
              <i className={`${message.inBookmarks ? 'fas' : 'far'} fa-bookmark`} />
            </Button>
          )}
        </Mutation>
        <Mutation
          mutation={queries.MOVE_MESSAGE_TO_TRASH}
          variables={{ messageId: message._id, inInbox }}
          onCompleted={({ moveMessageToTrash }) => {
            updateLoggedUserInbox(sentOrReceived, moveMessageToTrash);
          }}
          onError={utils.UIErrorNotifier}
        >
          {moveToTrash => (
            <Button className="message__btn" onClick={moveToTrash}>
              {message.inTrash
                ? 'Restore'
                : <i className="fas fa-trash" />
              }
            </Button>
          )}
        </Mutation>
        {message.inTrash && (
          <Mutation
            mutation={queries.DELETE_MESSAGE}
            variables={{ messageId: message._id, inInbox }}
            onCompleted={({ deletedMessageId }) => {
              console.log('cleaning', deletedMessageId);
              setLoggedUser((draft) => {
                const messagesArray = draft.inbox[sentOrReceived];
                messagesArray.splice(
                  messagesArray.findIndex(msg => msg._id === deletedMessageId), 1,
                );
              });
              Alert.success('Message deleted successfully');
              setShowConfirmationModal(false);
            }}
            onError={utils.UIErrorNotifier}
          >
            {deleteMessage => (
              <>
                <Button
                  classes="message__btn"
                  onClick={() => setShowConfirmationModal(true)}
                >
                  <i className="fas fa-trash" />
                </Button>
                {showConfirmationModal && (
                  <ConfirmationModal
                    onConfirm={deleteMessage}
                    onCancel={() => setShowConfirmationModal(false)}
                    onConfirmText="Delete"
                    confirmationQuestion="Are you sure you want to delete this message?"
                    theme="danger"
                  />
                )}
              </>
            )}
          </Mutation>
        )}
        {message.from._id !== loggedUserId && (
          <>
            <Button classes="message__btn" onClick={() => setShowReplyModal(true)}>
              <i className="fas fa-reply" />
            </Button>
            <Button classes="message__btn message__report-btn" onClick={() => setShowReportModal(true)}>
              <i className="fas fa-flag" />
            </Button>
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
    </li>
  );
};

Message.propTypes = {
  message: MessagePropTypes.isRequired,
  fromOrTo: oneOf(['from', 'to']).isRequired,
  loggedUserId: string.isRequired,
};

export default Message;
