var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

exports.renderTemplate = function(templateName, context) {
  var templatePath = path.join(__dirname, '../templates/' + templateName + '.ejs');
  var tmpl = fs.readFileSync(templatePath, 'utf8').replace(/\r/g, '');
  var html = ejs.render(tmpl, context);
  return html;
};

exports.renderTemplateToFile = function(targetFileName, templateName, context) {
  var stream = fs.createWriteStream(targetFileName);
  stream.once('open', function(fd) {
    stream.write(exports.renderTemplate(templateName, context));
    stream.end();
  });
};
