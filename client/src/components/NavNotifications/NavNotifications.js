import React, { useState, useRef, cloneElement } from 'react';
import { string, node } from 'prop-types';
import useOutsideClick from '../../hooks/useOutsideClick';

import './NavNotifications.sass';

const NavNotifications = ({ iconClass, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const notificationBoxRef = useRef(null);

  useOutsideClick(notificationBoxRef, () => setIsOpen(false));

  const isOpenToggler = () => setIsOpen(!isOpen);

  return (
    <div
      className="nav__notifications"
      ref={notificationBoxRef}
      onClick={isOpenToggler}
    >
      <i className={`${iconClass} fa-fw notifications__icon `} />
      {cloneElement(children, { isOpen, isOpenToggler })}
    </div>
  );
};

NavNotifications.propTypes = {
  iconClass: string.isRequired,
  children: node.isRequired,
};

export default NavNotifications;
