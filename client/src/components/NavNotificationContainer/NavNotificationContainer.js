import React, { useState, useRef } from 'react';
import { string, func } from 'prop-types';
import useOutsideClick from '../../hooks/useOutsideClick';

const NavNotificationContainer = ({ iconClass, render }) => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationBoxRef = useRef(null);

  useOutsideClick(notificationBoxRef, () => setIsOpen(false));

  const isOpenToggler = () => setIsOpen(!isOpen);

  return (
    <div
      ref={notificationBoxRef}
      className={iconClass}
      onClick={isOpenToggler}
    >
      {render(isOpen, isOpenToggler)}
    </div>
  );
};

NavNotificationContainer.propTypes = {
  iconClass: string.isRequired,
  render: func.isRequired,
};

export default NavNotificationContainer;
