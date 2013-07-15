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

  var _ = grunt.util._;

  var path    = require('path'),
      fs      = require('fs'),
      cleaner = /^\s+|\s+$|[\r\n]+/gm,
      doT     = require('dot');

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
  GruntDotCompiler.compileTemplates = function(files, opt) {

    var js = '';

    var opt = _.defaults(opt || {}, {
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
      js += 'if(typeof define !== "function") {' + grunt.util.linefeed;
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
      var key = opt.key(filePath);
      var contents = grunt.file.read(filePath)
        .replace(/\/\/.*\n/g,'')
        .replace(/ *load\(['|"](.*)['|"]\) */g, function(m, _filePath) {
          var _path;
          // Check relative path
          if(/^\./.test(_filePath)) {
            _path = path.join(gruntRoot, path.dirname(filePath), _filePath);
          } else {
            _path = path.join(opt.root, _filePath);
          }
          return fs.readFileSync(_path);
        })
        .replace(cleaner, '')
        .replace(/'/g, "\\'")
        .replace(/\/\*.*?\*\//gm,'')

      var compile = opt.prefix + '\'' + contents + '\', undefined, defs' + opt.suffix + ';' + grunt.util.linefeed;
      compile = eval(compile);
      js += '  tmpl' + "['" + key + "']=" + compile + ';' + grunt.util.linefeed;
    });


    if(!opt.requirejs && !opt.node) {
      js += 'return tmpl;})()'
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
