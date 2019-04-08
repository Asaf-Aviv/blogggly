import React from 'react';
import { func, string } from 'prop-types';

import './ConfirmationModal.sass';

const ConfirmationModal = ({
  onConfirm, onCancel, onCancelText,
  confirmationQuestion, onConfirmText,
  theme,
}) => (
  <div className={`confirmation__modal confirmation__modal--${theme}`}>
    <div className="confirmation">
      <button
        className="confirmation__close-btn"
        type="button"
        onClick={onCancel}
      >
        <i className="fas fa-times" />
      </button>
      <p className="confirmation__text">{confirmationQuestion}</p>
      <div className="confirmation__btn-group">
        <button
          className="btn btn--default"
          type="button"
          onClick={onCancel}
        >
          {onCancelText}
        </button>
        <button
          className={`btn btn--${theme}`}
          type="button"
          onClick={onConfirm}
        >
          {onConfirmText}
        </button>
      </div>
    </div>
  </div>
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
