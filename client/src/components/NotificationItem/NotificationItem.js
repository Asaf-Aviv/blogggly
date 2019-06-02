import React from 'react';
import { func, shape, string } from 'prop-types';
import moment from 'moment';
import { Mutation } from 'react-apollo';
import queries from '../../graphql/queries';
import Button from '../Button';
import { UserShortSummaryPropTypes } from '../../propTypes';

import './NotificationItem.sass';

const NotificationItem = ({
  notification,
  readNotificationCb,
  deleteNotificationCb,
}) => {
  const {
    _id: notificationId, from, body, createdAt, isRead,
  } = notification;

  return (
    <li>
      <div className={`notifications__item ${isRead ? '' : 'notifications__item--unread'}`}>
        <Mutation
          mutation={queries.DELETE_NOTIFICATION}
          variables={{ notificationId }}
          onCompleted={deleteNotificationCb}
        >
          {deleteNotification => (
            <Button classes="notifications__delete-btn" onClick={deleteNotification}>
              <i className="fas fa-times" />
            </Button>
          )}
        </Mutation>
        <span className="notifications__body">{`${from.username} ${body}`}</span>
        <div className="notifications__footer">
          <i className="fas fa-fw fa-comment-alt" />
          <span>{moment(+createdAt).startOf('seconds').fromNow()}</span>
          <Mutation
            mutation={queries.READ_NOTIFICATION}
            variables={{ notificationId }}
            onCompleted={readNotificationCb}
          >
            {readNotification => (
              <Button classes="notifications__bookmark-btn" text="Mark as Read" onClick={readNotification} />
            )}
          </Mutation>
        </div>
      </div>
    </li>
  );
};

NotificationItem.propTypes = {
  notification: shape({
    _id: string.isRequired,
    body: string.isRequired,
    createdAt: string.isRequired,
    from: UserShortSummaryPropTypes,
  }).isRequired,
  readNotificationCb: func.isRequired,
  deleteNotificationCb: func.isRequired,
};

export default NotificationItem;
