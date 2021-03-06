import Alert from 'react-s-alert';
import apolloClient from '../../ApolloClient';
import queries from '../queries';

const subscribeToCurrentUserUpdates = (setLoggedUser) => {
  const friendRequestObserver$ = apolloClient.subscribe(
    { query: queries.NEW_FRIEND_REQUEST },
  );
  const followersUpdatesObserver$ = apolloClient.subscribe(
    { query: queries.FOLLOWERS_UPDATES },
  );
  const acceptedFriendRequestObserver$ = apolloClient.subscribe(
    { query: queries.ACCEPTED_FRIEND_REQUEST },
  );
  const declinedFriendRequestObserver$ = apolloClient.subscribe(
    { query: queries.DECLINED_FRIEND_REQUEST },
  );
  const canceledFriendRequestObserver$ = apolloClient.subscribe(
    { query: queries.CANCELED_FRIEND_REQUEST },
  );
  const deletedFriendObserver$ = apolloClient.subscribe(
    { query: queries.DELETE_FRIEND },
  );
  const theyCommentOnMyPostObserver$ = apolloClient.subscribe(
    { query: queries.THEY_COMMENT_ON_MY_POST },
  );
  const theyLikeMyPostObserver$ = apolloClient.subscribe(
    { query: queries.THEY_LIKE_MY_POST },
  );
  const theyLikeMyCommentObserver$ = apolloClient.subscribe(
    { query: queries.THEY_LIKE_MY_COMMENT },
  );
  const newMessageObserver$ = apolloClient.subscribe(
    { query: queries.NEW_MESSAGE },
  );

  const friendRequestSubscription = friendRequestObserver$.subscribe({
    next: ({ data: { newFriendRequest: { user, notification } } }) => {
      Alert.success(`${user.username} just sent you a friend request!`);
      setLoggedUser((loggedUser) => {
        loggedUser.incomingFriendRequests.unshift(user._id);
        loggedUser.notifications.unshift(notification);
      });
    },
    error: err => console.error(err),
  });

  const followersUpdatesSubscription = followersUpdatesObserver$.subscribe({
    next: ({ data: { followersUpdates: { follower, isFollow, notification } } }) => {
      if (isFollow) {
        Alert.success(`${follower.username} is now following you!`);
      }

      setLoggedUser((loggedUser) => {
        if (isFollow) {
          loggedUser.followers.unshift(follower._id);
          loggedUser.notifications.unshift(notification);
        } else {
          loggedUser.followers.splice(loggedUser.followers.indexOf(follower._id), 1);
        }
      });
    },
    error: err => console.error(err),
  });

  const acceptedFriendRequestSubscription = acceptedFriendRequestObserver$.subscribe({
    next: ({ data: { acceptedFriendRequest: { user, notification } } }) => {
      Alert.success(`${user.username} just accepted your friend request!`);

      setLoggedUser((loggedUser) => {
        loggedUser.friends.push(user._id);
        loggedUser.notifications.unshift(notification);
        loggedUser.sentFriendRequests.splice(
          loggedUser.sentFriendRequests.indexOf(user._id), 1,
        );
      });
    },
    error: err => console.error(err),
  });

  const declinedFriendRequestSubscription = declinedFriendRequestObserver$.subscribe({
    next: ({ data: { declinedFriendRequest } }) => {
      setLoggedUser((loggedUser) => {
        loggedUser.sentFriendRequests.splice(
          loggedUser.sentFriendRequests.indexOf(declinedFriendRequest), 1,
        );
      });
    },
    error: err => console.error(err),
  });

  const canceledFriendRequestSubscription = canceledFriendRequestObserver$.subscribe({
    next: ({ data: { canceledFriendRequest } }) => {
      setLoggedUser((loggedUser) => {
        loggedUser.incomingFriendRequests.splice(
          loggedUser.incomingFriendRequests.indexOf(canceledFriendRequest), 1,
        );
      });
    },
    error: err => console.error(err),
  });

  const deletedFriendSubscription = deletedFriendObserver$.subscribe({
    next: ({ data: { deletedFriendId } }) => {
      setLoggedUser((loggedUser) => {
        loggedUser.friends.splice(
          loggedUser.friends.indexOf(deletedFriendId), 1,
        );
      });
    },
    error: err => console.error(err),
  });

  const theyCommentOnMyPostSubscription = theyCommentOnMyPostObserver$.subscribe({
    next: ({ data: { theyCommentOnMyPost: { commentAuthor, notification } } }) => {
      Alert.success(`${commentAuthor.username} just comment on your post!`);
      setLoggedUser((loggedUser) => {
        loggedUser.notifications.unshift(notification);
      });
    },
    error: err => console.error(err),
  });

  const theyLikeMyPostSubscription = theyLikeMyPostObserver$.subscribe({
    next: ({ data: { theyLikeMyPost: { user, notification } } }) => {
      Alert.success(`${user.username} just liked your post!`);
      setLoggedUser((loggedUser) => {
        loggedUser.notifications.unshift(notification);
      });
    },
    error: err => console.error(err),
  });

  const theyLikeMyCommentSubscription = theyLikeMyCommentObserver$.subscribe({
    next: ({ data: { theyLikeMyComment: { user, notification } } }) => {
      Alert.success(`${user.username} just liked your comment!`);
      setLoggedUser((loggedUser) => {
        loggedUser.notifications.unshift(notification);
      });
    },
    error: err => console.error(err),
  });

  const newMessageSubscription = newMessageObserver$.subscribe({
    next: ({ data: { newMessage: { message, notification } } }) => {
      Alert.success(`${message.from.username} just sent you a message!`);
      setLoggedUser((loggedUser) => {
        loggedUser.notifications.unshift(notification);
        loggedUser.inbox.inbox.unshift(message);
      });
    },
    error: err => console.error(err),
  });

  return [
    friendRequestSubscription,
    followersUpdatesSubscription,
    acceptedFriendRequestSubscription,
    declinedFriendRequestSubscription,
    canceledFriendRequestSubscription,
    deletedFriendSubscription,
    theyCommentOnMyPostSubscription,
    theyLikeMyPostSubscription,
    theyLikeMyCommentSubscription,
    newMessageSubscription,
  ];
};

export default subscribeToCurrentUserUpdates;
