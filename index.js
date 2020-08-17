var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index/index.html');
});

app.get('/s/docs', function (req, res) {
  res.sendFile(__dirname + '/public/docs/index.html');
});

app.get('/s/*', function (req, res) {
  res.sendFile(__dirname + '/public/s/index.html');
});

var server = require('http').Server(app);

server.listen(3133, function () {
  console.log(`Listening on ${server.address().port}`);
});