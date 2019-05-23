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
  const friendRequestObserver$ = apolloClient.subscribe({ query: queries.NEW_FRIEND_REQUEST });
  const followersUpdatesObserver$ = apolloClient.subscribe({ query: queries.FOLLOWERS_UPDATES });

  const friendRequestSubscription = friendRequestObserver$.subscribe({
    next: ({ data: { newFriendRequest } }) => {
      console.log(newFriendRequest);
      Alert.success(`${newFriendRequest.username} just sent you a friend request`);
      setLoggedUser((draft) => {
        draft.incomingFriendRequests.unshift(newFriendRequest._id);
      });
    },
    error: err => console.error(err),
  });

  const followersUpdatesSubscription = followersUpdatesObserver$.subscribe({
    next: ({ data: { followersUpdates: { follower, isFollow } } }) => {
      if (isFollow) {
        Alert.success(`${follower.username} is now following you`);
      }

      setLoggedUser((draft) => {
        isFollow
          ? draft.followers.unshift(follower._id)
          : draft.followers.splice(draft.followers.indexOf(follower._id), 1);
      });
    },
    error: err => console.error(err),
  });

  return [
    friendRequestSubscription,
    followersUpdatesSubscription,
  ];
};
