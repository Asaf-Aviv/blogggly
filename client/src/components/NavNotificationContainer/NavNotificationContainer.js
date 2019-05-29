import React, { useState, useRef, cloneElement } from 'react';
import { string, node } from 'prop-types';
import useOutsideClick from '../../hooks/useOutsideClick';

const NavNotificationContainer = ({ iconClass, children }) => {
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
      {cloneElement(children, { isOpen, isOpenToggler })}
    </div>
  );
};

NavNotificationContainer.propTypes = {
  iconClass: string.isRequired,
  children: node.isRequired,
};

export default NavNotificationContainer;
