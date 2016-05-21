/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Billy Kwok
*/
var loaderUtils = require("loader-utils");
var mime = require("mime");

module.exports = function(content) {
  this.cacheable && this.cacheable();

  var query = loaderUtils.parseQuery(this.query);
  var limit = (this.options && this.options.url && this.options.url.dataUrlLimit) || 0;
  var emit = true;

  if (query.limit) limit = parseInt(query.limit, 10);
  if (typeof query.emit !== 'undefined' && query.emit === 'false') emit = false;

  var mimetype = query.mimetype ||
                 query.minetype ||
                 mime.lookup(this.resourcePath);

  // Use data url
  if (limit <= 0 || content.length < limit) {
    return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + ";" : "") + "base64," + content.toString("base64"));
  // Use file-loader
  } else if (emit) {
    var fileLoader = require("file-loader");
    return fileLoader.call(this, content);
  // Use file-loader without emitting files
  } else {
    var url = loaderUtils.interpolateName(this, query.name || "[hash].[ext]", {
      context: query.context || this.options.context,
      content: content,
      regExp: query.regExp
    });
    return "module.exports = __webpack_public_path__ + " + JSON.stringify(url) + ";";
  }
}

module.exports.raw = true;
