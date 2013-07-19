/*
 * grunt-dot-compiler
 * https://github.com/tinganho/grunt-dot-compiler
 *
 * Copyright (c) 2013 Tingan Ho
 * Licensed under the MIT license.
 */

 module.exports = function(grunt) {

  "use strict";

  grunt.util = grunt.util || grunt.utils;

  var path       = require('path')
    , _          = grunt.util._
    , fs         = require('fs')
    , cleaner    = /^\s+|\s+$|[\r\n]+/gm
    , doT        = require('dot')
    , loadRegex  = /load\(['|"](.*?)['|"]\,?\s*(\{\s*(.*?\s*?)+?\})?\s*\)/g;

  var gruntRoot = path.dirname(grunt.file.findup('Gruntfile.js')) + '/';

  grunt.registerMultiTask('dot', 'prepares and combines any type of template into a script include', function() {
    // grap the filepattern
    var files = grunt.file.expand({filter: 'isFile'}, this.files[0].src);
    // create the hogan include
    var src = GruntDotCompiler.compileTemplates(files, this.data.options);
    // write the new file
    grunt.file.write(this.files[0].dest, src);
    // log our success
    grunt.log.writeln('File "' + this.files[0].dest + '" created.');
  });

  var GruntDotCompiler = {};
  GruntDotCompiler.getAbsolutePath = function(filePath, _filePath, opt) {
    var _path;
    // Check relative path
    if(/^\./.test(_filePath)) {
      _path = path.join(gruntRoot, path.dirname(filePath), _filePath);
    } else {
      _path = path.join(opt.root, _filePath);
    }
    return _path;
  };

  GruntDotCompiler.loadPartials = function(m, filePath, _filePath, obj, opt) {
    var _path, customVars = {}, _this = this;
    if(typeof obj !== 'undefined') {
      var matches = obj.match(/(\w+)\s*\:(.*)\s*/g);
      for(var i = 0; i < matches.length; i++) {
        var _matches = /(\w+)\s*\:(.*)\s*/g.exec(matches[i]);
        customVars[_matches[1]] = _matches[2].replace(/'|"|\,|\s*/g, '');
      }
    }

    _path = GruntDotCompiler.getAbsolutePath(filePath, _filePath, opt);

    var content = fs.readFileSync(_path, 'utf8');

    if(loadRegex.test(content)) {
      content = content.replace(loadRegex, function(m, _filePath, obj) {
        var content = _this.loadPartials(m, filePath, _filePath, obj, opt);
        return content;
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

    return content;
  };
  GruntDotCompiler.getFileContent = function(filePath, opt) {
    var _this = this;

    var contents = grunt.file.read(filePath)
      .replace(/\/\/.*\n/g,'')
      .replace(loadRegex, function(m, _filePath, obj) {
        var content = _this.loadPartials(m, filePath, _filePath, obj, opt);
        return content;
      })
      .replace(/\{\{\$\s*\w*?\s*\:\s*(.*?)\s*\}\}/g, function(m, p1) {
        return p1;
      })
      .replace(cleaner, '')
      .replace(/'/g, "\\'")
      .replace(/\/\*.*?\*\//gm,'');

    return contents;
  };
  GruntDotCompiler.compileTemplates = function(files, opt) {

    var js = '', _this = this;

    opt = _.defaults(opt || {}, {
      variable: 'tmpl',
      key: function(filepath) {
        return path.basename(filepath, path.extname(filepath));
      },
      prefix: 'doT.template(',
      suffix: ')',
      node: false,
      requirejs: false,
      root: gruntRoot
    });

    // Sanetize
    opt.variable = opt.variable.replace('window.', '');
    if(opt.root.substr(-1) !== '/') {
      opt.root += '/';
    }

    // RequireJS
    if(!opt.requirejs && !opt.node) {
      if(opt.variable.indexOf('.') !== -1) {
        js += opt.variable + ' = (function(){' + grunt.util.linefeed;
      } else {
        js += 'var ' + opt.variable + ' = (function(){' + grunt.util.linefeed;
      }
    }
    if(opt.requirejs && opt.node) {
      js += 'if(typeof define !== \'function\') {' + grunt.util.linefeed;
      js += 'define = require(\'amdefine\')(module);' + grunt.util.linefeed;
      js += '}' + grunt.util.linefeed;
    }

    if(opt.requirejs) {
      js += 'define(function() {' + grunt.util.linefeed;
    }

    // Defining encodeHTML method for the templates
    js += 'function encodeHTMLSource() {';
    js += 'var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", \'"\': \'&#34;\', "\'": \'&#39;\', "/": \'&#47;\' },';
    js += 'matchHTML = /&(?!#?\w+;)|<|>|"|\'|\\//g;';
    js += 'return function() {';
    js += 'return this ? this.replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : this;';
    js += '};';
    js += '};' + grunt.util.linefeed;

    js += '  String.prototype.encodeHTML=encodeHTMLSource();' + grunt.util.linefeed;

    js += '  var tmpl = {};' + grunt.util.linefeed;


    var defs = {};
    defs.loadfile = function( path ) {
      return fs.readFileSync( path );
    };
    defs.root = opt.root;

    files.map(function(filePath) {
      var contents = _this.getFileContent(filePath, opt);
      var key = opt.key(filePath);
      var compile = opt.prefix + '\'' + contents + '\', undefined, defs' + opt.suffix + ';' + grunt.util.linefeed;
      compile = eval(compile);
      js += '  tmpl' + "['" + key + "']=" + compile + ';' + grunt.util.linefeed;
    });


    if(!opt.requirejs && !opt.node) {
      js += 'return tmpl;})()';
    } else if(opt.requirejs) {
      js += 'return tmpl;});' + grunt.util.linefeed;
    } else if(opt.simple && opt.node){
      js += '';
    } else if(opt.node) {
      js += 'module.exports = tmpl;';
    }

    return js;

  };

};
