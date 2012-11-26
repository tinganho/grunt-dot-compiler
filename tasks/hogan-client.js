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
  
  var path = require('path'),
      fs = require('fs'),
      cleaner = /^\s+|\s+$|[\r?\n]+/gm;

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('hoganclient', 'prepares and combines hogan templates into a script include', function() {
    // grap the filepattern
    var files = grunt.file.expandFiles(this.file.src);
    // create the hogan include
    var src = grunt.helper('hoganclient', files, this.data.options);
    // write the new file
    grunt.file.write(this.file.dest, src);
    // log our success
    grunt.log.writeln('File "' + this.file.dest + '" created.');
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('hoganclient', function(files, options) {
    var src = '';

    options = grunt.utils._.defaults(options || {}, {
      variable: 'tmpl',
      ext: 'hogan'
    });

    src += options.variable.indexOf('.') === -1 ? 'var ' + options.variable : options.variable;
    src += '={};' + grunt.utils.linefeed;

    files.map(function(filepath) {
      var name = path.basename(filepath, '.' + options.ext);
      var file = grunt.file.read(filepath).replace(cleaner, '');
      src += options.variable + '.' + name + '=Hogan.compile(\'' + file + '\');' + grunt.utils.linefeed;
    });

    return src;
  });

};
