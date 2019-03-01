import React, { useState, useContext } from 'react';
import {
  string, bool, arrayOf, shape, number, node, func,
} from 'prop-types';
import Container from '../Container';
import UserAvatar from '../UserAvatar';
import { UserContext } from '../../context';

import './Inbox.sass';

const InboxMenuItem = ({ category, iconClass, badge }) => (
  <li className="inbox__sidebar-menu-item" data-category={category.toLowerCase()}>
    <i className={`inbox__sidebar-menu-icon ${iconClass}`} />
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
};

const MessageBoard = ({ messages, active, loggedUserId }) => (
  <ul className="message__menu" data-active={active}>
    {messages.map(message => (
      <li key={message._id} className="message">
        <span className="message__from">{message[message.from === loggedUserId ? 'to' : 'from']}</span>
        <span className="message__body">{message.body}</span>
      </li>
    ))}
  </ul>
);

MessageBoard.propTypes = {
  loggedUserId: string.isRequired,
  messages: arrayOf(shape({
    _id: string.isRequired,
    from: string.isRequired,
    to: string.isRequired,
    body: string.isRequired,
    createdAt: string.isRequired,
    read: bool.isRequired,
  })).isRequired,
  active: bool.isRequired,
};

const Inbox = () => {
  const [showCategory, setShowCategory] = useState('inbox');
  const { loggedUser } = useContext(UserContext);

  if (!loggedUser) return null;

  const { inbox } = loggedUser;

  const setCategoryHandler = (e) => {
    const target = e.target.tagName === 'LI'
      ? e.target
      : e.target.parentNode;

    setShowCategory(target.dataset.category);
  };

  return (
    <Container>
      <div className="inbox">
        <InboxHeader avatar={loggedUser.avatar} username={loggedUser.username} />
        <InboxSearchbar />
        <InboxSidebar setCategory={setCategoryHandler}>
          <InboxMenuItem iconClass="fas fa-inbox" category="Inbox" badge={inbox.inbox.filter(m => !m.read).length} />
          <InboxMenuItem iconClass="fas fa-envelope" category="Sent" badge={inbox.sent.filter(m => !m.read).length} />
          <InboxMenuItem iconClass="far fa-bookmark" category="Bookmarks" badge={inbox.bookmarks.filter(m => !m.read).length} />
          <InboxMenuItem iconClass="fas fa-trash" category="Trash" badge={inbox.trash.filter(m => !m.read).length} />
        </InboxSidebar>
        <InboxContent>
          <MessageBoard loggedUserId={loggedUser._id} messages={inbox.inbox} active={showCategory === 'inbox'} />
          <MessageBoard loggedUserId={loggedUser._id} messages={inbox.sent} active={showCategory === 'sent'} />
          <MessageBoard loggedUserId={loggedUser._id} messages={inbox.bookmarks} active={showCategory === 'bookmarks'} />
          <MessageBoard loggedUserId={loggedUser._id} messages={inbox.trash} active={showCategory === 'trash'} />
        </InboxContent>
      </div>
    </Container>
  );
};

const InboxSearchbar = () => (
  <div className="inbox__searchbar">
    <input type="text" />
  </div>
);

const InboxHeader = ({ avatar, username }) => (
  <header className="inbox__header">
    <UserAvatar avatar={avatar} username={username} />
    <h4>{username}</h4>
  </header>
);

InboxHeader.propTypes = {
  avatar: string.isRequired,
  username: string.isRequired,
};

const InboxSidebar = ({ children, setCategory }) => (
  <div className="inbox__sidebar">
    <ul className="inbox__sidebar-menu" onClick={setCategory}>
      {children}
    </ul>
  </div>
);

InboxSidebar.propTypes = {
  children: arrayOf(node).isRequired,
  setCategory: func.isRequired,
};

const InboxContent = ({ children }) => (
  <main className="inbox-content__container">
    <div className="inbox-content">
      {children}
    </div>
  </main>
);

InboxContent.propTypes = {
  children: arrayOf(node).isRequired,
};

export default Inbox;
