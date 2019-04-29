import React, { useState } from 'react';
import Alert from 'react-s-alert';
import { string, func } from 'prop-types';
import { Mutation } from 'react-apollo';
import queries from '../../graphql/queries';
import Emoji from '../Emoji';
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
        closeModal();
        Alert.success('Thank you for the report');
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
            <button
              className="report-form__close-btn"
              type="button"
              onClick={closeModal}
            >
              <i className="fas fa-times" />
            </button>
            <h3 className="report-form__title">
              Hi
              {' '}
              <Emoji emoji="👋" label="waving hand" />
              {' '}
              Thanks for taking the time to make blogggly a better place.
            </h3>
            <textarea
              rows="4"
              className="report-form__textarea"
              placeholder="Please describe the reason of the report"
              onChange={e => setReason(e.target.value)}
              required
            />
            <div className="report-form__btn-group">
              <button onClick={closeModal} className="btn btn--default" type="button">Cancel</button>
              <button className="btn btn--danger" type="submit">Report</button>
            </div>
          </form>
        </TransparentModal>
      ))}
    </Mutation>
  );
};

ReportModal.propTypes = {
  reportedId: string.isRequired,
  type: string.isRequired,
  closeModal: func.isRequired,
};

export default ReportModal;
