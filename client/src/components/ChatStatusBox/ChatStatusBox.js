import React, { useState, useRef } from 'react';
import useOutsideClick from '../../hooks/useOutsideClick';

import './ChatStatusBox.sass';

const ChatStatusBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('Online');

  const statusDropdownRef = useRef();
  useOutsideClick(statusDropdownRef, () => setIsOpen(false));

  const toggleIsOpen = () => setIsOpen(prevState => !prevState);

  const setNextStatus = nextStatus => () => setStatus(nextStatus);

  const renderStatusOption = nextStatus => (
    <span
      key={nextStatus}
      className="chat-status__dropdown-item"
      onClick={setNextStatus(nextStatus)}
    >
      {nextStatus}
    </span>
  );

  return (
    <div className="chat-status__container">
      <span className="chat-status--current" onClick={toggleIsOpen}>{status}</span>
      {isOpen && (
        <div
          ref={statusDropdownRef}
          className="chat-status__dropdown"
          onClick={toggleIsOpen}
        >
          {['Online', 'Away', 'Do Not Disturb', 'Offline'].map(renderStatusOption)}
        </div>
      )}
    </div>
  );
};

export default ChatStatusBox;
