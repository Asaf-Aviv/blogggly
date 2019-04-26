import React from 'react';
import { Mutation } from 'react-apollo';
import { string, func } from 'prop-types';
import queries from '../../graphql/queries';
import utils from '../../utils';

const FriendRequestButton = ({ userId, render }) => (
  <Mutation
    mutation={queries.SEND_FRIEND_REQUEST}
    variables={{ userId }}
    onError={utils.UIErrorNotifier}
    onCompleted={({ sendFriendRequest }) => {
      console.log(sendFriendRequest);
    }}
  >
    {sendFriendRequest => render(sendFriendRequest)}
  </Mutation>
);

FriendRequestButton.propTypes = {
  userId: string.isRequired,
  render: func.isRequired,
};

export default FriendRequestButton;
