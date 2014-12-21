var express = require('express');
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');

var parseCodepenMd = require('./parse');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
    // Todo: walk through all codepen.md with thumbnail images
    res.end('hello!');
});

app.get('*.md', function(req, res, next) {
    // console.log(parseCodepenMd(req.path.replace('/', '')));
    res.end(parseCodepenMd(req.path.replace('/', '')));
});

app.use(express.static(__dirname + '/app'));
server.listen(4000, '0.0.0.0');