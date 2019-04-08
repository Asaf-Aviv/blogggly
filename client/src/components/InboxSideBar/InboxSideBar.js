import React from 'react';
import { arrayOf, node, func } from 'prop-types';

import './InboxSideBar.sass';

const InboxSideBar = ({ children, setCategory }) => (
  <nav className="inbox__sidebar">
    <ul className="inbox__sidebar-menu" onClick={setCategory}>
      {children}
    </ul>
  </nav>
);

InboxSideBar.propTypes = {
  children: arrayOf(node).isRequired,
  setCategory: func.isRequired,
};

export default InboxSideBar;
