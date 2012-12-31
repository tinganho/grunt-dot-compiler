/*
 * grunt-hogan-client
 * https://github.com/markus.ullmark/grunt-hogan-client
 *
 * Copyright (c) 2012 Markus Ullmark
 * Licensed under the MIT license.
 */

 module.exports = function(grunt) {

  "use strict";

  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;

  var path = require('path'),
      fs = require('fs'),
      cleaner = /^\s+|\s+$|[\r\n]+/gm;

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('compile-templates', 'prepares and combines any type of template into a script include', function() {
    // grap the filepattern
    var files = grunt.file.expandFiles(this.file.src);
    // create the hogan include
    var src = grunt.helper('compile-templates', files, this.data.options);
    // write the new file
    grunt.file.write(this.file.dest, src);
    // log our success
    grunt.log.writeln('File "' + this.file.dest + '" created.');
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('compile-templates', function(files, options) {

    var js = '';

    options = _.defaults(options || {}, {
      variable: 'tmpl',
      key: function(filepath) {
        return path.basename(filepath, path.extname(filepath));
      },
      prefix: 'doT.template(',
      suffix: ')',
      nodeCompile: true
    });

    options.variable = options.variable.replace('window.', '');

    js += 'if( typeof define !== "function" ) {' + grunt.utils.linefeed;
    js +=   'define = require( "amdefine" )( module )' + grunt.utils.linefeed;
    js += '}' + grunt.utils.linefeed;

    js += 'define(function() {' + grunt.utils.linefeed;

      var variables = options.variable.split('.');

      _.each(variables, function(v) {
        js += 'var ' + v + '=' + v + '|| {};' + grunt.utils.linefeed;
      });

      var doT = require( 'yeoman-express-dot' );

      var defs = {};
      defs.loadfile = function( path ) {
        return fs.readFileSync( path );
      };
      defs.root = options.root;

      files.map(function(filepath) {

        var key = options.key(filepath);
        var contents = grunt.file.read(filepath).replace(cleaner, '').replace(/'/g, "\\'");

        var compile = options.prefix + '\'' + contents + '\', undefined, defs' + options.suffix + ';' + grunt.utils.linefeed;

        if( options.nodeCompile ) {
          compile = eval( compile );
          console.log(key + ' = ' + compile);
        }

        js += ' ' + options.variable + "['" + key + "']=" + compile + grunt.utils.linefeed;


      });

      js += 'return ' + options.variable + ';});' + grunt.utils.linefeed;

    return js;

  });

};
