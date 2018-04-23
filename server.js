const express = require('express');
const path = require('path');
const controllers = require('./controllers');

const app = express();

app.use('/api', require('./remotes'));

app.use(express.static(path.join(__dirname, 'client/built')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/built/index.html'));
});

const port = process.env.PORT || 8000;
app.listen(port);

console.log(`Server running on ${port}`);