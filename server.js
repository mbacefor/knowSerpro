var express = require('express');
var app = express();
var path = require('path');

const PORT = process.env.PORT || 8080

const buildPath = path.resolve(__dirname, 'dist');

app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res) {
  res.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(PORT);
