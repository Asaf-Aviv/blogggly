import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import App from './App';
import * as serviceWorker from './serviceWorker';
import apolloClient from './ApolloClient';


ReactDOM.render(
  <Router>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </Router>,
  document.getElementById('root'),
);

serviceWorker.unregister();
