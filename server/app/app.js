
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

const PORT = process.env.PORT || 5000;
const devMode = process.env.NODE_ENV !== 'production';

console.log('NODE_ENV', process.env.NODE_ENV);

if (devMode) {
  mongoose.set('debug', true);
}

app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../../client/build')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());
app.use(isAuth);

app.get('/ping', (req, res) => res.send('pong'));

app.get('/*', (req, res) => {
  res.sendFile(
    path.join(
      __dirname, '../../client/build/', 'index.html',
    ),
  );
});

app.post('/upload', checkAuth, (req, res) => {
  multerUploader.single('avatar')(req, res, err => handleFileUpload(req, res, err));
});

apolloServer.applyMiddleware({ app });

apolloServer.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`🚀  Apollo Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`);
  console.log(`🚀  Apollo Subscriptions ready at ws://localhost:${PORT}${apolloServer.subscriptionsPath}`);
});

module.exports = app;
