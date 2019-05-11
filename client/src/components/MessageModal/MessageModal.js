import React from 'react';
import { func } from 'prop-types';
import { MessagePropTypes } from '../../propTypes';

import './MessageModal.sass';
import TransparentModal from '../TransparentModal';

const MessageModal = ({ message, closeModal }) => (
  <TransparentModal onBackgroundClick={closeModal}>
    <h1>fullMessageModal</h1>
  </TransparentModal>
);

MessageModal.propTypes = {
  message: MessagePropTypes.isRequired,
  closeModal: func.isRequired,
};

export default MessageModal;
