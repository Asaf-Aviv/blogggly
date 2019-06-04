import React from 'react';
import {
  string, oneOfType, node, arrayOf, bool,
} from 'prop-types';
import BloggglyLink from '../BloggglyLink';
import UserAvatar from '../UserAvatar';

import './NotificationItem.sass';

const NotificationItem = ({
  avatar, username, children, isRead,
}) => {
  const isReadClass = isRead !== null && !isRead
    ? 'notifications__item--unread'
    : '';

  return (
    <li>
      <div className={`notifications__item ${isReadClass}`}>
        <UserAvatar avatar={avatar} username={username} width={40} />
        <div className="notifications__content">
          <BloggglyLink to={`/user/${username}`} text={username} />
          {' '}
          {children}
        </div>
      </div>
    </li>
  );
};

NotificationItem.propTypes = {
  avatar: string.isRequired,
  username: string.isRequired,
  isRead: bool,
  children: oneOfType([node, arrayOf(node)]).isRequired,
};

NotificationItem.defaultProps = {
  isRead: null,
};

export default NotificationItem;
