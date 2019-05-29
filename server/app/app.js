
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const compression = require('compression');
const { createServer } = require('http');
const path = require('path');
const { multerUploader } = require('../utils');
const handleFileUpload = require('../middleware/handleFileUpload');
const checkAuth = require('../middleware/checkAuth');
const isAuth = require('../middleware/isAuth');
const apolloServer = require('../apolloServer');

const app = express();
const httpServer = createServer(app);

const PORT = process.env.NODE_ENV || 5000;
const devMode = process.env.NODE_ENV !== 'production';

if (devMode) {
  mongoose.set('debug', true);
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, '../client/dist')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(isAuth);

app.get('/ping', (req, res) => res.send('pong'));


app.post('/upload', checkAuth, (req, res) => {
  multerUploader.single('avatar')(req, res, err => handleFileUpload(req, res, err));
});

apolloServer.applyMiddleware({
  app,
  // onHealthCheck: () => new Promise((resolve, reject) => {
  //   console.log('health check');
  //   resolve();
  //   reject();
  // }),
});
apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀  Apollo Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  console.log(`🚀  Apollo Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);
});

app.get('/*', (req, res) => {
  res.sendFile(
    path.join(
      __dirname, `../../client/${devMode ? 'public' : 'dist'}`, 'index.html',
    ),
  );
});

module.exports = app;
