import React, { useState, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { string, number, bool } from 'prop-types';
import Container from '../Container';
import { UserContext } from '../../context';
import MessageBoard from '../MessageBoard';
import InboxSideBar from '../InboxSideBar';

import './Inbox.sass';

const notInTrash = m => !m.inTrash;

const renderInboxItem = (
  category, iconClass, badge, active,
) => (
  <InboxMenuItem
    category={category}
    iconClass={`fas fa-${iconClass}`}
    badge={badge}
    active={active}
  />
);

const InboxMenuItem = ({
  category, iconClass, badge, active,
}) => (
  <li
    className={`inbox__sidebar-item ${active ? 'inbox__sidebar-item--active' : ''}`}
    data-category={category.toLowerCase()}
  >
    <i className={`inbox__sidebar-icon ${iconClass}`} />
    <span className="inbox__sidebar-text">{category}</span>
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

const Inbox = () => {
  const [showCategory, setShowCategory] = useState('inbox');
  const { loggedUser } = useContext(UserContext);

  if (!loggedUser) return null;

  const renderMessageBoard = () => {
    switch (showCategory) {
      case 'inbox':
        return <MessageBoard loggedUserId={loggedUser._id} messages={inbox.filter(notInTrash)} />;
      case 'sent':
        return <MessageBoard loggedUserId={loggedUser._id} messages={sent.filter(notInTrash)} />;
      case 'bookmarks':
        return <MessageBoard loggedUserId={loggedUser._id} messages={bookmarks} />;
      case 'trash':
        return <MessageBoard loggedUserId={loggedUser._id} messages={trash} />;
      default:
        throw new Error('unknown category');
    }
  };

  const { inbox: { inbox, sent } } = loggedUser;

  const setCategory = (e) => {
    const target = e.target.tagName === 'LI'
      ? e.target
      : e.target.parentNode;

    setShowCategory(target.dataset.category);
  };

  const bookmarks = [];
  const trash = [];

  [...inbox, ...sent]
    .forEach((message) => {
      if (message.inTrash) trash.push(message);
      else if (message.inBookmarks) bookmarks.push(message);
    });

  return (
    <div className="inbox">
      <Helmet>
        <title>Inbox - Blogggly</title>
      </Helmet>
      <Container>
        <InboxSideBar setCategory={setCategory}>
          {renderInboxItem('Inbox', 'inbox', inbox.filter(notInTrash).length, showCategory === 'inbox')}
          {renderInboxItem('Sent', 'paper-plane', sent.filter(notInTrash).length, showCategory === 'sent')}
          {renderInboxItem('Bookmarks', 'bookmark', bookmarks.length, showCategory === 'bookmarks')}
          {renderInboxItem('Trash', 'trash', trash.length, showCategory === 'trash')}
        </InboxSideBar>
        <div className="inbox-content__container">
          <div className="inbox-content">
            {renderMessageBoard()}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Inbox;
