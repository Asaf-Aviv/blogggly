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

export const subscribeToCurrentUserUpdates = (setLoggedUser, currentUserId) => {
  const observer$ = apolloClient.subscribe(
    { query: queries.NEW_FRIEND_REQUEST, variables: { currentUserId } },
  );

  const friendRequestSubscription = observer$.subscribe({
    next: ({ data: { newFriendRequest } }) => {
      console.log(newFriendRequest);
      Alert.success(`${newFriendRequest.username} just sent you a friend request`);
      setLoggedUser((draft) => {
        draft.incomingFriendRequests.unshift(newFriendRequest._id);
      });
    },
    error: err => console.error(err),
    complete: () => console.log('complete'),
  });

  return [
    friendRequestSubscription,
  ];
};
