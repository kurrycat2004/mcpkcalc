var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile('/home/runner/mcpkcalc/public/index/index.html');
});

app.get('/s/*', function(req,res) {
  res.sendFile('/home/runner/mcpkcalc/public/s/index.html');
});

var server = require('http').Server(app);

server.listen(function() {
  console.log(`Listening on ${server.address().port}`);
});