
/**
 * Module dependencies.
 */

var grunt = require('grunt')
  , _     = grunt.util._
  , path  = require('path')
  , fs    = require('fs')
  , doT   = require('dot')

/**
 * Compiler.
 */

var Compiler = function(opt) {
  this.opt = _.defaults(opt || {}, {
    variable  : 'tmpl',
    node      : false,
    root      : opt.gruntRoot,
    requirejs : false,
    key       : function(filepath) {
      return path.basename(filepath, path.extname(filepath));
    }
  });
  this.opt.variable = opt.variable.replace('window.', '');
  if(this.opt.root.substr(-1) !== '/') {
    this.opt.root += '/';
  }

  this.loadRegex = /\{\{\#\#\s*(def\.\w+)\s*\:\s*load\(['|"](.*?)['|"]\,?\s*(\{\s*(.*?\s*?)+?\})?\s*\);?\s*\#?\}\}/g;

  _.bindAll(this);
};

/**
 * Get absolute path.
 */

Compiler.prototype.getAbsolutePath = function(filePath, loadPath) {
  var res;
  // Check relative path
  if(/^\./.test(loadPath)) {
    res = path.join(this.opt.gruntRoot, path.dirname(filePath), loadPath);
  } else {
    res = path.join(this.opt.root, loadPath);
  }
  return res;
};

/**
 * Load partials.
 */

Compiler.prototype.loadPartials = function(m, filePath, loadPath, obj) {
  var customVars = {}, _this = this, pendingPartialLoads = {};

  if(typeof obj !== 'undefined') {
    var matches = obj.match(/(\w+)\s*\:(.*)\s*/g);
    for(var i = 0; i < matches.length; i++) {
      var _matches = /(\w+)\s*\:(.*)\s*/g.exec(matches[i]);
      customVars[_matches[1]] = _matches[2].replace(/'|"|\,|\s*/g, '');
    }
  }

  var content = fs.readFileSync(this.getAbsolutePath(filePath, loadPath), 'utf8');

  if(this.loadRegex.test(content)) {
    content = content.replace(this.loadRegex, function(m, namespace, loadPath, obj) {
      var content = _this.loadPartials(m, filePath, loadPath, obj);
      pendingPartialLoads[namespace] = content;
      return '';
    });
  }

  if(typeof obj !== 'undefined') {
    for(var key in customVars) {
      var regex = new RegExp('\\{\\{\\$\\s*(' + key + ')\\s*\\:?\\s*(.*?)\\s*\\}\\}');
      content = content.replace(regex, function(m, key, defaultValue) {
        if(typeof customVars[key] === 'undefined' && typeof defaultValue === 'undefined') {
          return '';
        } else if(typeof val !== 'undefined') {
          return defaultValue;
        } else {
          return customVars[key];
        }
      });
    }
  }

  content = this.loadPendingPartials(content, pendingPartialLoads);

  return content;
};

/**
 * Loads pending partials.
 */

Compiler.prototype.loadPendingPartials = function(content, pendingPartialLoads) {
  for(var namespace in pendingPartialLoads) {
    content = content.replace(
      new RegExp('\\{\\{\\#\\s*' + namespace + '\\s*\\}\\}'),
      function(m) {
        return pendingPartialLoads[namespace];
      });
  }
  content = content.replace(/\{\{\$\s*\w*?\s*\:\s*(.*?)\s*\}\}/g, function(m, p1) {
    return p1;
  });
  return content;
};

/**
 * Get file content.
 */

Compiler.prototype.getFileContent = function(filePath) {
  var _this = this, pendingPartialLoads = {};

  var content = grunt.file.read(filePath)
    .replace(/\/\/.*\n/g,'')
    .replace(this.loadRegex, function(m, namespace, loadPath, obj) {
      var content = _this.loadPartials(m, filePath, loadPath, obj);
      pendingPartialLoads[namespace] = content;
      return '';
    })
    .replace(/^\s+|\s+$|[\r\n]+/gm, '')
    .replace(/\/\*.*?\*\//gm,'');

  content = this.loadPendingPartials(content, pendingPartialLoads);
  return content;
};

/**
 * Compile templates.
 */

Compiler.prototype.compileTemplates = function(files) {

  var js = '', _this = this;

  // RequireJS
  if(!this.opt.requirejs && !this.opt.node) {
    if(this.opt.variable.indexOf('.') !== -1) {
      js += this.opt.variable + ' = (function(){' + grunt.util.linefeed;
    } else {
      js += 'var ' + this.opt.variable + ' = (function(){' + grunt.util.linefeed;
    }
  }

  if(this.opt.requirejs && !this.opt.node) {
    js += 'if(typeof define !== \'function\') {' + grunt.util.linefeed;
    js += '  define = require(\'amdefine\')(module);' + grunt.util.linefeed;
    js += '}' + grunt.util.linefeed;
  }

  if(this.opt.requirejs) {
    js += 'define(function() {' + grunt.util.linefeed;
  }

  // Defining encodeHTML method for the templates
  js += 'function encodeHTMLSource() {';
  js += '  var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", \'"\': \'&#34;\', "\'": \'&#39;\', "/": \'&#47;\' },';
  js += '  matchHTML = /&(?!#?\w+;)|<|>|"|\'|\\//g;';
  js += '  return function() {';
  js += '    return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;';
  js += '  };';
  js += '};' + grunt.util.linefeed;
  js += 'String.prototype.encodeHTML=encodeHTMLSource();' + grunt.util.linefeed;

  js += 'var tmpl = {};' + grunt.util.linefeed;

  files.map(function(filePath) {
    var template = _this.getFileContent(filePath)
      , fn       = doT.template(template)
      , key      = _this.opt.key(filePath);
    js += '  tmpl' + "['" + key + "']=" + fn + ';' + grunt.util.linefeed;
  });

  if(!this.opt.requirejs && !this.opt.node) {
    js += 'return tmpl;})()';
  } else if(this.opt.requirejs) {
    js += 'return tmpl;});' + grunt.util.linefeed;
  } else if(this.opt.simple && this.opt.node){
    js += '';
  } else if(this.opt.node) {
    js += 'module.exports = tmpl;';
  }

  return js;

};

module.exports = Compiler;
