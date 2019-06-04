import React, { useState, useContext } from 'react';
import Container from '../Container';
import { UserContext } from '../../context';
import InboxMenuItem from '../InboxMenuItem';
import MessageBoard from '../MessageBoard';
import InboxSideBar from '../InboxSideBar';
import InboxContent from '../InboxContent';

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

const Inbox = () => {
  const [showCategory, setShowCategory] = useState('inbox');
  const { loggedUser } = useContext(UserContext);

  if (!loggedUser) return null;

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
      <Container>
        <InboxSideBar setCategory={setCategory}>
          {renderInboxItem('Inbox', 'inbox', inbox.filter(notInTrash).length, showCategory === 'inbox')}
          {renderInboxItem('Sent', 'envelope', sent.filter(notInTrash).length, showCategory === 'sent')}
          {renderInboxItem('Bookmarks', 'bookmark', bookmarks.length, showCategory === 'bookmarks')}
          {renderInboxItem('Trash', 'trash', trash.length, showCategory === 'trash')}
        </InboxSideBar>
        <InboxContent>
          <MessageBoard loggedUserId={loggedUser._id} messages={inbox.filter(notInTrash)} active={showCategory === 'inbox'} />
          <MessageBoard loggedUserId={loggedUser._id} messages={sent.filter(notInTrash)} active={showCategory === 'sent'} />
          <MessageBoard loggedUserId={loggedUser._id} messages={bookmarks} active={showCategory === 'bookmarks'} />
          <MessageBoard loggedUserId={loggedUser._id} messages={trash} active={showCategory === 'trash'} />
        </InboxContent>
      </Container>
    </div>
  );
};

export default Inbox;
