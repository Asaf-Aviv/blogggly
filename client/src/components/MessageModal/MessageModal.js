import React from 'react';
import moment from 'moment';
import { func, bool, node } from 'prop-types';
import { MessagePropTypes } from '../../propTypes';
import TransparentModal from '../TransparentModal';
import UserAvatar from '../UserAvatar';
import BloggglyLink from '../BloggglyLink';

import './MessageModal.sass';

const MessageModal = ({
  message, isAuthor, closeModal, children,
}) => {
  const fromOrTo = isAuthor ? 'to' : 'from';
  const { body, [fromOrTo]: { avatar, username } } = message;

  return (
    <TransparentModal onBackgroundClick={closeModal}>
      <div className="message-modal__message" onClick={e => e.stopPropagation()}>
        <div className="message-modal__header">
          <UserAvatar width={60} avatar={avatar} username={username} />
          <BloggglyLink to={`/user/${username}`} text={username} />
          <span className="message-modal__date">{moment(+message.createdAt).startOf('seconds').fromNow()}</span>
        </div>
        <div className="message-modal__body">{body}</div>
        {children}
      </div>
    </TransparentModal>
  );
};

MessageModal.propTypes = {
  message: MessagePropTypes.isRequired,
  isAuthor: bool.isRequired,
  closeModal: func.isRequired,
  children: node.isRequired,
};

export default MessageModal;
