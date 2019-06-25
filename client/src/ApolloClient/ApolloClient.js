import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? `Bearer ${token}` : '';
};

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    Authorization: getToken(),
  },
}));

const httpLink = new HttpLink({
  uri: process.env.REACT_APP_HTTP_URL,
});

const wsClient = new SubscriptionClient(
  process.env.REACT_APP_SOCKET_URL,
  {
    reconnect: true,
    lazy: true,
    connectionParams: () => ({
      Authorization: getToken(),
    }),
  },
);

const wsLink = new WebSocketLink(wsClient);

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    // split based on operation type
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  // order matters ws before http.
  wsLink,
  httpLink,
);

// order matters, httpLink needs to read headers from auth
const link = ApolloLink.from([authLink, terminatingLink]);

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link,
  cache,
});

export { apolloClient as default, wsClient };
