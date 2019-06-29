import React from 'react';
import { func, string } from 'prop-types';
import Button from '../Button';
import TransparentModal from '../TransparentModal';

import './ConfirmationModal.sass';

const ConfirmationModal = ({
  onConfirm,
  onCancel,
  onCancelText,
  confirmationQuestion,
  onConfirmText,
  theme,
}) => (
  <TransparentModal className="confirmation__modal" onBackgroundClick={onCancel}>
    <div className="confirmation" onClick={e => e.stopPropagation()}>
      <Button classes="confirmation__close-btn" onClick={onCancel}>
        <i className="fas fa-times" />
      </Button>
      <h3 className="confirmation__text">{confirmationQuestion}</h3>
      <div className="confirmation__btn-group">
        <Button
          classes="btn btn--default"
          onClick={onCancel}
          text={onCancelText}
        />
        <Button
          classes={`btn btn--${theme}`}
          onClick={onConfirm}
          text={onConfirmText}
        />
      </div>
    </div>
  </TransparentModal>
);

ConfirmationModal.propTypes = {
  onConfirm: func.isRequired,
  onCancel: func.isRequired,
  confirmationQuestion: string.isRequired,
  onConfirmText: string,
  onCancelText: string,
  theme: string,
};

ConfirmationModal.defaultProps = {
  onConfirmText: 'Confirm',
  onCancelText: 'Cancel',
  theme: 'default',
};

export default ConfirmationModal;
