/*
// /(compass|Bourbon), less(hat), stylus(nib), nope
// normalize, reset,  nope
// autoprefixer, nope
*/
var fs = require('fs');
var Mustache = require('Mustache');
var x = require('lodash');
var sass = require('node-sass');

var content = fs.readFileSync('css3-pseudo-sound-bars.md', 'utf8');

var blockReg = /(```(html|css|js)\s*\n)((.|\n)*?)(```\s*\n?)/;
var annotationReg = /^<!--\n((.|\n)*?)-->/;
var jsFileReg = /.js$/;
var cssFileReg = /.css$/;

function getAnnotation(text, type) {
    var _dict = {}, part;
    try {
        part = text.split(/^<!--\n((.|\n)*?)-->\n/);
        part[1].trim().split(/\n/).forEach(function(item, idx) {
            var parts = item.split(':');
            _dict[parts[0]] = parts[1].trim();
        });
        textMap[type] = part[3];
    } catch (e) {}
    return _dict;
}


var textMap = {
    js: '',
    css: '',
    html: ''
}; // default map
var annotationMap = {};


var match;
while (match = blockReg.exec(content)) {
    var type = match[1].split('```')[1].replace(/\n/g, '');
    textMap[type] = match[3];
    content = content.replace(match[1], '');
}

var baseTpl = fs.readFileSync('BASE-TPL.html', 'utf8');

/* Process Defined Here */
annotationMap = x.mapValues(textMap, getAnnotation);

if (annotationMap.css.prefix === 'prefix-free') {
    annotationMap.html.link = annotationMap.html.link || [];
    annotationMap.html.link += ',//cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js';
}
if (annotationMap.css.preprocess === 'scss') {
    textMap.css = sass.renderSync(textMap.css.trim());
}

if (annotationMap.html.link) {
    annotationMap.html.link = x.map(annotationMap.html.link.split(','), function(item) {
        if (jsFileReg.test(item)) {
            return '<script type="text/javascript" src="SRC"></script>'.replace('SRC', item);
        }
        if (cssFileReg.test(item)) {
            return '<link rel="stylesheet" type="text/css" href="HREF">'.replace('HREF', item);
        }
    });
} else {
    annotationMap.html.link = [];
}

Mustache.render(baseTpl, {
    Title: 'css3-pseudo-sound-bars.md',
    MetaBlock: annotationMap.html.meta ? annotationMap.html.meta.replace(',', '\n') : '',
    LinkBlock: annotationMap.html.link.join('\n'),
    StyleBlock: textMap.css || '',
    MarkupBlock: textMap.html || '',
    ScriptBlock: textMap.js || ''
});