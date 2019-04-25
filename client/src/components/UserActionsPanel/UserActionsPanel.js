import React, { useState } from 'react';
import { bool, string } from 'prop-types';
import FollowButton from '../FollowButton';
import SendMessageModal from '../SendMessageModal';
import ReportModal from '../ReportModal/ReportModal';

import './UserActionsPanel.sass';

const UserActionsPanel = ({ following, userId, username }) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  return (
    <div className="actions-panel">
      <div className="action" onClick={() => setShowMessageModal(true)}>
        <i className="action__icon far fa-envelope" />
      </div>
      <div className="action" onClick={() => setShowReportModal(true)}>
        <i className="action__icon far fa-flag" />
      </div>
      <FollowButton following={following} userId={userId} username={username} />
      {showMessageModal && (
        <SendMessageModal
          userId={userId}
          username={username}
          closeModal={() => setShowMessageModal(false)}
        />
      )}
      {showReportModal && (
        <ReportModal
          reportedId={userId}
          type="user"
          closeModal={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

UserActionsPanel.propTypes = {
  following: bool.isRequired,
  userId: string.isRequired,
  username: string.isRequired,
};

export default UserActionsPanel;
