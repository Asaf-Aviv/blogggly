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
    <div className={`notifications__item ${isRead ? '' : 'notifications__item--unread'}`}>
      <Mutation
        mutation={queries.READ_NOTIFICATION}
        variables={{ notificationId }}
        onCompleted={readNotificationCb}
      >
        {readNotification => (
          <Button text="Mark as Read" onClick={readNotification} />
        )}
      </Mutation>
      <Mutation
        mutation={queries.DELETE_NOTIFICATION}
        variables={{ notificationId }}
        onCompleted={deleteNotificationCb}
      >
        {deleteNotification => (
          <Button text="Delete" onClick={deleteNotification} />
        )}
      </Mutation>
      <span>{`${from.username} ${body}`}</span>
      <span>{moment(+createdAt).startOf('seconds').fromNow()}</span>
    </div>
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
