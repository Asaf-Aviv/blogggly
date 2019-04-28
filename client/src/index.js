import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import App from './App';
import * as serviceWorker from './serviceWorker';
import apolloClient from './ApolloClient';

const rootEl = document.getElementById('root');

ReactDOM.render(
  <Router>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </Router>,
  rootEl,
);

if (module.hot) {
  module.hot.accept('./App', () => {
    const NextApp = require('./App').default;
    ReactDOM.render(
      <NextApp />,
      rootEl,
    );
  });
}

serviceWorker.unregister();
