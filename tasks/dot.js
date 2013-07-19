
/**
 * Module dependencies.
 */

var path = require('path')
  , Compiler = require('../src/Compiler');

/*
 * Export grunt task
 */

 module.exports = function(grunt) {

  "use strict";

  grunt.registerMultiTask('dot', 'prepares and combines any type of template into a script include', function() {
    this.data.options.gruntRoot = path.dirname(grunt.file.findup('Gruntfile.js')) + '/';
    var files = grunt.file.expand({filter: 'isFile'}, this.files[0].src)
      , compiler = new Compiler(this.data.options)
      , src = compiler.compileTemplates(files);
    grunt.file.write(this.files[0].dest, src);
    grunt.log.writeln('File "' + this.files[0].dest + '" created.');
  });
};
