import React from 'react';
import { func, string } from 'prop-types';

import './ConfirmationModal.sass';

const ConfirmationModal = ({
  onConfirm, onCancel, onCancelText,
  confirmationQuestion, onConfirmText,
  theme,
}) => (
  <div className={`confirmation__modal confirmation__modal--${theme}`} onClick={onCancel}>
    <div className="confirmation" onClick={e => e.stopPropagation()}>
      <button
        className="confirmation__close-btn"
        type="button"
        onClick={onCancel}
      >
        <i className="fas fa-times" />
      </button>
      <h3 className="confirmation__text">{confirmationQuestion}</h3>
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
