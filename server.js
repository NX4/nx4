const express = require('express');
const path = require('path');
const log = require('log-util');

const app = express();

app.use('/api', require('./remotes'));

app.use(express.static(path.join(__dirname, 'client/built')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/built/index.html'));
});

const port = process.env.PORT || 8000;
app.listen(port);

log.debug(`Server running on port: ${port}`);