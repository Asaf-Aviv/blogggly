import ApolloClient from 'apollo-boost';

const apolloClient = new ApolloClient({
  request: (operation) => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
    });
  },
});

export default apolloClient;
