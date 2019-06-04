import { useEffect } from 'react';
import subscribeToCurrentUserUpdates from '../graphql/helpers/subscribeToCurrentUserUpdates';
import { wsClient } from '../ApolloClient';

const useUserSubscriptions = (subscriptionRef, loggedUser, setLoggedUser) => {
  useEffect(() => {
    if (loggedUser && !subscriptionRef.current) {
      subscriptionRef.current = subscribeToCurrentUserUpdates(setLoggedUser);
    }
    if (!loggedUser && subscriptionRef.current) {
      subscriptionRef.current.forEach((subscription) => {
        subscription.unsubscribe();
      });
      subscriptionRef.current = null;
      // force a reconnect without a token
      wsClient.close(false, false);
    }
  }, [loggedUser, setLoggedUser, subscriptionRef]);
};

export default useUserSubscriptions;
