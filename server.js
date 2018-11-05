const express = require('express');
const path = require('path');
const log = require('log-util');
const throng = require('throng');
const enforce = require('express-sslify');

const port = process.env.PORT || 8000;
const WORKERS = process.env.WEB_CONCURRENCY || 1;

throng({
    workers: WORKERS,
    lifetime: Infinity
  },
  start
);

function start() {
  const app = express();
  
  app.use(enforce.HTTPS({ trustProtoHeader: true }))

  app.use('/api', require('./remotes'));

  app.use(express.static(path.join(__dirname, 'client/built')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/built/index.html'));
  });

  app.listen(port);

  log.debug(`Server running on port: ${port}`);
}
