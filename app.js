var express = require('express');
var livereload = require('express-livereload');
var bodyParser = require('body-parser');
var Mustache = require('Mustache');
var fs = require('fs');
var x = require('lodash');

var app = express();
var server = require('http').createServer(app);
livereload(app, config={watchDir: '.', exts: ['md']});

var parseCodepenMd = require('./parse');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

function getFiles(dir,files_){
    files_ = files_ || [];
    if (typeof files_ === 'undefined') files_=[];
    var files = fs.readdirSync(dir);
    for(var i in files){
        if (!files.hasOwnProperty(i)) continue;
        var name = dir+'/'+files[i];
        if (fs.statSync(name).isDirectory()){
            getFiles(name,files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

app.get('/', function(req, res, next) {
    // Todo: walk through all codepen.md with thumbnail images
    var pens = x.map(getFiles('snippets'), function(i) {
        return {link: i};
    });
    var ret = Mustache.render(fs.readFileSync('INDEX-TPL.html', 'utf8'), {
        Pens: pens
    });
    res.end(ret);
});

app.get('*.md', function(req, res, next) {
    // console.log(parseCodepenMd(req.path.replace('/', '')));
    res.end(parseCodepenMd(req.path.slice(1))); // remove slash at first
});

app.use(express.static(__dirname + '/app'));
server.listen(4000, '0.0.0.0');