import Alert from 'react-s-alert';
import apolloClient from '../../ApolloClient';
import queries from '../queries';

export const subscriptionHandler = (query, subscriptionQuery, cacheUpdateFn, error, complete) => {
  const observer$ = apolloClient.subscribe(subscriptionQuery);

  return observer$.subscribe({
    next: ({ data, result = data[Object.keys(data)[0]] }) => {
      cacheUpdateFn(result, query);
    },
    error,
    complete,
  });
};

export const subscribeToCurrentUserUpdates = (setLoggedUser) => {
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
  const theyLikeMyPostObserver$ = apolloClient.subscribe(
    { query: queries.THEY_LIKE_MY_POST },
  );

  const friendRequestSubscription = friendRequestObserver$.subscribe({
    next: ({ data: { newFriendRequest } }) => {
      console.log(newFriendRequest);
      Alert.success(`${newFriendRequest.username} just sent you a friend request`);
      setLoggedUser((loggedUser) => {
        loggedUser.incomingFriendRequests.unshift(newFriendRequest._id);
      });
    },
    error: err => console.error(err),
  });

  const followersUpdatesSubscription = followersUpdatesObserver$.subscribe({
    next: ({ data: { followersUpdates: { follower, isFollow } } }) => {
      if (isFollow) {
        Alert.success(`${follower.username} is now following you`);
      }

      setLoggedUser((loggedUser) => {
        isFollow
          ? loggedUser.followers.unshift(follower._id)
          : loggedUser.followers.splice(loggedUser.followers.indexOf(follower._id), 1);
      });
    },
    error: err => console.error(err),
  });

  const acceptedFriendRequestSubscription = acceptedFriendRequestObserver$.subscribe({
    next: ({ data: { acceptedFriendRequest: newFriend } }) => {
      console.log(newFriend);
      Alert.success(`${newFriend.username} just accepted your friend request!`);

      setLoggedUser((loggedUser) => {
        loggedUser.friends.push(newFriend._id);
        loggedUser.sentFriendRequests.splice(
          loggedUser.sentFriendRequests.indexOf(newFriend._id), 1,
        );
      });
    },
    error: err => console.error(err),
  });

  const declinedFriendRequestSubscription = declinedFriendRequestObserver$.subscribe({
    next: ({ data: { declinedFriendRequest } }) => {
      console.log(declinedFriendRequest);

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
      console.log(canceledFriendRequest);

      setLoggedUser((loggedUser) => {
        loggedUser.incomingFriendRequests.splice(
          loggedUser.incomingFriendRequests.indexOf(canceledFriendRequest), 1,
        );
      });
    },
    error: err => console.error(err),
  });

  const theyLikeMyPostSubscription = theyLikeMyPostObserver$.subscribe({
    next: ({ data: { theyLikeMyPost } }) => {
      Alert.success(`${theyLikeMyPost.username} just liked your post`);
    },
    error: err => console.error(err),
  });

  return [
    friendRequestSubscription,
    followersUpdatesSubscription,
    acceptedFriendRequestSubscription,
    declinedFriendRequestSubscription,
    canceledFriendRequestSubscription,
    theyLikeMyPostSubscription,
  ];
};
