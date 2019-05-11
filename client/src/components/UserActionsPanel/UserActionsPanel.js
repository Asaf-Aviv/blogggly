import React, { useState } from 'react';
import {
  bool, string, oneOfType, node, arrayOf,
} from 'prop-types';
import FollowButton from '../FollowButton';
import SendMessageModal from '../SendMessageModal';
import ReportModal from '../ReportModal';
import FriendRequestActions from '../FriendRequestActions';

import './UserActionsPanel.sass';

const PopUp = ({ children }) => (
  <div className="pop-up">
    {children}
  </div>
);

PopUp.propTypes = {
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

const UserActionsPanel = ({
  following, isAFriend, friendRequestPending, userId, username,
  isIncomingFriendRequest,
}) => {
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showFriendRequestPopUp, setShowFriendRequestPopUp] = useState(false);

  const setNextPopUpState = nextState => () => {
    setShowFriendRequestPopUp(nextState || !showFriendRequestPopUp);
  };

  return (
    <div className="actions-panel">
      <div className="action" onClick={() => setShowMessageModal(true)}>
        <i className="action__icon fas fa-envelope" />
      </div>
      {!isAFriend && !friendRequestPending && (
        <FriendRequestActions
          toSend
          userId={userId}
          render={sendFriendRequest => (
            <div className="action" onClick={sendFriendRequest}>
              <i className="action__icon fas fa-user-plus" />
            </div>
          )}
        />
      )}
      {isAFriend && (
        <div className="action">
          <i className="action__icon fas fa-user-check" />
        </div>
      )}
      {friendRequestPending && (
        isIncomingFriendRequest
          ? (
            <div
              className="action action--friend-request"
              onClick={setNextPopUpState()}
            >
              <i className="action__icon fas fa-user-clock" />
              {showFriendRequestPopUp && (
                <PopUp>
                  <FriendRequestActions
                    incoming
                    userId={userId}
                    username={username}
                    render={(declineFriendRequest, accpetFriendRequest) => (
                      <div className="friend-request-actions">
                        <button
                          className="btn btn--sm btn--default"
                          type="button"
                          onClick={declineFriendRequest}
                        >
                        Decline
                        </button>
                        <button
                          className="btn btn--sm btn--success"
                          type="button"
                          onClick={accpetFriendRequest}
                        >
                        Accpet
                        </button>
                      </div>
                    )}
                  />
                </PopUp>
              )}
            </div>
          )
          : (
            <div className="action" onClick={setNextPopUpState()}>
              <i className="action__icon fas fa-user-clock" />
              {showFriendRequestPopUp && (
                <PopUp>
                  <FriendRequestActions
                    userId={userId}
                    pending
                    render={cancelFriendRequest => (
                      <div className="friend-request-actions">
                        <button
                          className="btn btn--sm btn--default"
                          type="button"
                          onClick={cancelFriendRequest}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  />
                </PopUp>
              )}
            </div>
          )
      )}
      <div className="action" onClick={() => setShowReportModal(true)}>
        <i className="action__icon fas fa-flag" />
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
  isIncomingFriendRequest: bool.isRequired,
  friendRequestPending: bool.isRequired,
  isAFriend: bool.isRequired,
  userId: string.isRequired,
  username: string.isRequired,
};

export default UserActionsPanel;
