import React, { useState } from 'react';
import Alert from 'react-s-alert';
import { string, func, oneOf } from 'prop-types';
import { Mutation } from 'react-apollo';
import queries from '../../graphql/queries';
import Emoji from '../Emoji';
import Button from '../Button';
import TransparentModal from '../TransparentModal';

import './ReportModal.sass';

const ReportModal = ({ reportedId, type, closeModal }) => {
  const [reason, setReason] = useState('');

  return (
    <Mutation
      mutation={queries.REPORT}
      variables={{
        report: {
          reportedId, reason, type,
        },
      }}
      onCompleted={() => {
        Alert.success('Thank you for your report');
        closeModal();
      }}
    >
      {(report => (
        <TransparentModal onBackgroundClick={closeModal}>
          <form
            onClick={e => e.stopPropagation()}
            className="report__form"
            onSubmit={async (e) => {
              e.preventDefault();
              report();
            }}
          >
            <Button
              classes="report-form__close-btn"
              onClick={closeModal}
            >
              <i className="fas fa-times" />
            </Button>
            <h3 className="report-form__title">
              Hi
              {' '}
              <Emoji emoji="👋" label="waving hand" />
              {' '}
              Thank you for taking the time to make blogggly a better place.
            </h3>
            <textarea
              rows="4"
              className="report-form__textarea"
              placeholder="Please describe the reason of the report"
              onChange={e => setReason(e.target.value)}
              required
            />
            <div className="report-form__btn-group">
              <Button onClick={closeModal} classes="btn btn--default" text="Cancel" />
              <Button type="submit" classes="btn btn--danger" text="Report" />
            </div>
          </form>
        </TransparentModal>
      ))}
    </Mutation>
  );
};

ReportModal.propTypes = {
  reportedId: string.isRequired,
  type: oneOf(['user', 'post', 'comment', 'message']).isRequired,
  closeModal: func.isRequired,
};

export default ReportModal;
