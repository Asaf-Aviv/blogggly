import apolloClient from '../../ApolloClient';

// eslint-disable-next-line import/prefer-default-export
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
