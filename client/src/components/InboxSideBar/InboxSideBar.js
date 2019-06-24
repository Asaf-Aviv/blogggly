import React from 'react';
import { arrayOf, node, func } from 'prop-types';
import useWindowWidth from '../../hooks/useWindowWidth';

import './InboxSideBar.sass';

const InboxSideBar = ({ children, setCategory }) => {
  const isMobileClass = useWindowWidth() <= 786 && 'inbox__sidebar--mobile';

  return (
    <nav className={`inbox__sidebar ${isMobileClass}`}>
      <ul className="inbox__sidebar-menu" onClick={setCategory}>
        {children}
      </ul>
    </nav>
  );
};

InboxSideBar.propTypes = {
  children: arrayOf(node).isRequired,
  setCategory: func.isRequired,
};

export default InboxSideBar;
