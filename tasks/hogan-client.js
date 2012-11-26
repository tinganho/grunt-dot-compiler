/*
 * grunt-hogan-client
 * https://github.com/markus.ullmark/grunt-hogan-client
 *
 * Copyright (c) 2012 Markus Ullmark
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/gruntjs/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('hogan-client', 'Your task description goes here.', function() {
    grunt.log.write(grunt.helper('hogan-client'));
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('hogan-client', function() {
    return 'hogan-client!!!';
  });

};
