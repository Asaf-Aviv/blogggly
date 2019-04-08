import React from 'react';
import { string, number, bool } from 'prop-types';

import './InboxMenuItem.sass';

const InboxMenuItem = ({
  category, iconClass, badge, active,
}) => (
  <li
    className={`inbox__sidebar-item ${active ? 'inbox__sidebar-item--active' : ''}`}
    data-category={category.toLowerCase()}
  >
    <i className={`inbox__sidebar-icon ${iconClass}`} />
    {category}
    <div className="menu-badge">
      {badge}
    </div>
  </li>
);

InboxMenuItem.propTypes = {
  category: string.isRequired,
  iconClass: string.isRequired,
  badge: number.isRequired,
  active: bool.isRequired,
};

export default InboxMenuItem;
