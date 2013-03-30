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

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

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

  // ==========================================================================
  // HELPERS
  // ==========================================================================
  var GruntDotCompiler = {};
  GruntDotCompiler.compileTemplates = function(files, options) {

    var js = '';

    options = _.defaults(options || {}, {
      variable: 'tmpl',
      key: function(filepath) {
        return path.basename(filepath, path.extname(filepath));
      },
      prefix: 'doT.template(',
      suffix: ')',
      node: true,
      requirejs: true,
      root: gruntRoot
    });

    // Sanetize
    options.variable = options.variable.replace('window.', '');
    if(options.root.substr(-1) !== '/') {
      options.root += '/';
    }

    // RequireJS
    if(options.requirejs && options.node) {
      js += 'if(typeof define !== "function") {' + grunt.util.linefeed;
      js +=   'define = require( "amdefine")(module)' + grunt.util.linefeed;
      js += '}' + grunt.util.linefeed;
    }

    if(options.requirejs) {
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

    js += 'String.prototype.encodeHTML=encodeHTMLSource();';
    js += "\n";

    var variables = options.variable.split('.');

    _.each(variables, function(v) {
      js += 'var ' + v + '=' + v + '|| {};' + grunt.util.linefeed;
    });

    var defs = {};
    defs.loadfile = function( path ) {
      return fs.readFileSync( path );
    };
    defs.root = options.root;

    files.map(function(filePath) {
      var key = options.key(filePath);
      var contents = grunt.file.read(filePath)
        .replace(/\/\/.*\n/g,'')
        .replace(/ *load\(['|"](.*)['|"]\) */g, function(m, _filePath) {
          var _path;
          // Check relative path
          if(/^\./.test(_filePath)) {
            _path = path.join(gruntRoot, path.dirname(filePath), _filePath);
          } else {
            _path = path.join(options.root, _filePath);
          }
          return fs.readFileSync(_path);
        })
        .replace(cleaner, '')
        .replace(/'/g, "\\'")
        .replace(/\/\*.*?\*\//gm,'')

      var compile = options.prefix + '\'' + contents + '\', undefined, defs' + options.suffix + ';' + grunt.util.linefeed;
      if( options.node ) {
        compile = eval( compile );
        console.log(key + ' = ' + compile);
      }
      js += ' ' + options.variable + "['" + key + "']=" + compile + grunt.util.linefeed;
    });

    if(options.requirejs) {
      js += 'return ' + options.variable + ';});' + grunt.util.linefeed;
    } else if(options.simple && options.node){
      js += '';
    } else if(options.node) {
      js += 'module.exports = ' + options.variable + ';';
    }

    return js;

  };

};
