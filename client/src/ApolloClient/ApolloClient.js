import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { ApolloLink, split } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';

const authLink = setContext((_, { headers }) => ({
  headers: {
    ...headers,
    authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
}));

const httpLink = new HttpLink({
  uri: 'http://localhost:5000/graphql',
});

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:5000/graphql',
  options: {
    reconnect: true,
  },
});

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

export default apolloClient;
