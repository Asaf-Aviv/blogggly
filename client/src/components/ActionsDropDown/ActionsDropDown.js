import React, { useState, useRef } from 'react';
import { oneOf, string, bool } from 'prop-types';
import useOutsideClick from '../../hooks/useOutsideClick';
import ReportModal from '../ReportModal/ReportModal';
import DeletePostButton from '../DeletePostButton';
import Button from '../Button';
import DeleteCommentButton from '../DeleteCommentButton';
import RemoveFriendButton from '../DeleteFriendButton';

import './ActionsDropDown.sass';

const ActionsDropDown = ({
  type, resourceId, isAuthor, postId, isAFriend,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const dropdownRef = useRef();
  useOutsideClick(dropdownRef, () => setIsOpen(false));

  const isOpenToggler = () => setIsOpen(!isOpen);

  return (
    <div ref={dropdownRef} onClick={isOpenToggler} className="actions-dropdown__container">
      <div className="actions-dropwdown__toggler-container">
        <i className="actions-dropdown__toggler fas fa-ellipsis-v" />
      </div>
      {isOpen && (
        <div className="actions-dropdown" onClick={e => e.stopPropagation()}>
          {isAFriend && <RemoveFriendButton userId={resourceId} />}
          {isAuthor
            ? (
              <>
                {type === 'post' && <DeletePostButton postId={resourceId} />}
                {type === 'comment' && <DeleteCommentButton commentId={resourceId} postId={postId} />}
              </>
            )
            : (
              <Button
                classes="actions-dropdown__btn"
                onClick={() => setShowReportModal(true)}
                text="Report"
              />
            )
          }
        </div>
      )}
      {showReportModal && (
        <ReportModal
          reportedId={resourceId}
          type={type}
          closeModal={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

ActionsDropDown.propTypes = {
  type: oneOf(['user', 'post', 'comment', 'message']).isRequired,
  resourceId: string.isRequired,
  isAuthor: bool,
  isAFriend: bool,
  postId: string,
};

ActionsDropDown.defaultProps = {
  postId: '',
  isAFriend: false,
  isAuthor: false,
};

export default ActionsDropDown;
