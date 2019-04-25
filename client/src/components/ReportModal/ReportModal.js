import React, { useState } from 'react';
import { string } from 'prop-types';
import { Mutation } from 'react-apollo';
import queries from '../../graphql/queries';

import './ReportModal.sass';

const ReportModal = ({ reportedId, type }) => {
  const [reason, setReason] = useState('');

  return (
    <Mutation
      mutation={queries.REPORT}
      variables={{
        report: {
          reportedId, reason, type,
        },
      }}
    >
      {(report => (
        <form onSubmit={(e) => {
          e.preventDefault();
          report();
        }}
        >
          <input
            type="text"
            placeholder="Please describe the reason of the report"
            onChange={e => setReason(e.target.value)}
            required
          />
          <button type="submit">report</button>
        </form>
      ))}
    </Mutation>
  );
};

ReportModal.propTypes = {
  reportedId: string.isRequired,
  type: string.isRequired,
};

export default ReportModal;
