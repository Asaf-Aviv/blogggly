import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import ReactGA from 'react-ga';
import createHistory from 'history/createBrowserHistory';
import App from './App';
import * as serviceWorker from './serviceWorker';
import apolloClient from './ApolloClient';

ReactGA.initialize(process.env.REACT_APP_GA);

const history = createHistory();

history.listen((location) => {
  ReactGA.set({ page: location.pathname });
  ReactGA.pageview(location.pathname);
});

const rootEl = document.getElementById('root');

ReactDOM.render(
  <Router history={history}>
    <ApolloProvider client={apolloClient}>
      <App />
    </ApolloProvider>
  </Router>,
  rootEl,
);

serviceWorker.unregister();
