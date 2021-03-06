import React, { useContext } from 'react';
import { bool, string, func } from 'prop-types';
import { Mutation } from 'react-apollo';
import Alert from 'react-s-alert';
import queries from '../../graphql/queries';
import { UserContext } from '../../context';
import utils from '../../utils';

const FriendRequestActions = ({
  userId, username, pending, incoming, toSend, render,
}) => {
  const { setLoggedUser } = useContext(UserContext);

  if (toSend) {
    return (
      <Mutation
        mutation={queries.SEND_FRIEND_REQUEST}
        variables={{ userId }}
        onError={utils.UIErrorNotifier}
        onCompleted={() => {
          Alert.success('Request sent successfully');
          setLoggedUser((draft) => {
            draft.sentFriendRequests.push(userId);
          });
        }}
      >
        {sendFriendRequest => render(sendFriendRequest)}
      </Mutation>
    );
  }

  if (pending) {
    return (
      <Mutation
        mutation={queries.CANCEL_FRIEND_REQUEST}
        variables={{ userId }}
        onError={utils.UIErrorNotifier}
        onCompleted={() => {
          setLoggedUser((draft) => {
            draft.sentFriendRequests.splice(
              draft.sentFriendRequests.indexOf(userId), 1,
            );
          });
        }}
      >
        {cancelFriendRequest => render(cancelFriendRequest)}
      </Mutation>
    );
  }

  if (incoming) {
    return (
      <Mutation
        mutation={queries.DECLINE_FRIEND_REQUEST}
        variables={{ userId }}
        onError={utils.UIErrorNotifier}
        onCompleted={() => {
          setLoggedUser((draft) => {
            draft.incomingFriendRequests.splice(
              draft.incomingFriendRequests.indexOf(userId), 1,
            );
          });
        }}
      >
        {declineFriendRequest => (
          <Mutation
            mutation={queries.ACCEPT_FRIEND_REQUEST}
            variables={{ userId }}
            onError={utils.UIErrorNotifier}
            onCompleted={() => {
              Alert.success(`You and ${username} are now friends`);
              setLoggedUser((draft) => {
                draft.friends.push(userId);
                draft.incomingFriendRequests.splice(
                  draft.incomingFriendRequests.indexOf(userId, 1),
                );
              });
            }}
          >
            {accpetFriendRequest => render(declineFriendRequest, accpetFriendRequest)}
          </Mutation>
        )}
      </Mutation>
    );
  }

  return null;
};

FriendRequestActions.propTypes = {
  userId: string.isRequired,
  username: string,
  render: func.isRequired,
  toSend: bool,
  incoming: bool,
  pending: bool,
};

FriendRequestActions.defaultProps = {
  username: '',
  toSend: false,
  incoming: false,
  pending: false,
};

export default FriendRequestActions;
