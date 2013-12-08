/*
usage:
node bin/parse_slides.js --slidesFolder=slides
*/
var dir = require('node-dir');
var yaml = require('js-yaml');
var marked = require('marked');
var argv = require('optimist').argv;
var path = require('path');
var utils = require('../lib/utils');
var slidePath = path.join(__dirname, '../', argv.slidesFolder || 'slides-example');
var slides = [];

var parseContent = function(content) {
  //console.log('content: \n', content);
  var headerRegex = /^\s*(([^\s\d\w])\2{2,})(?:\x20*([a-z]+))?([\s\S]*?)\1/;
  var match = headerRegex.exec(content);
  if(!match) {
    console.log('no match');
    return;
  }

  var separator = match[1];
  var parser = match[3] || 'yaml';
  var header = match[4].trim();
  var body = content.substring(match[0].length).trim();
  var settings = yaml.load(header);
  var extraClasses = [];
  if(body.length < 600) extraClasses.push('short');
  var ctx = {
    title: settings.title,
    caption: marked(body),
    image: settings.image,
    date: settings.date,
    extraClasses: extraClasses
  };
  console.log(settings.title, 'len:', body.length);
  slides.push(utils.renderTemplate(settings.layout, ctx));
};

var readSlides = function(callback) {
  var dir = require('node-dir');
  dir.readFiles(slidePath, {
    match: /.md$/
    }, function(err, content, next) {
      if (err) throw err;
      parseContent(content.trim());
      next();
    },
    function(err, files){
      console.log('finished reading files:',files);
      callback(err);
    });
};

var createSlideshow = function() {
  var slideshowTemplate = 'slideshow';
  var slideshowTarget = path.join(__dirname, '../build/slideshow.html');
  console.log('Creating slideshow to ', slideshowTarget);
  readSlides(function(err) {
    if(err) throw err;
    utils.renderTemplateToFile(slideshowTarget, slideshowTemplate, {slides: slides});
  });
};

createSlideshow();