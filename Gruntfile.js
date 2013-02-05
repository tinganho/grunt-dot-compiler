module.exports = function(grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    'compile-templates': {
      namespaced: {
        options: {
            variable: 'tmpl'
        },
        src: ['test/templates/**/*.dot'],
        dest: 'test/tmp/tmpl.js'
      }
    },

    nodeunit: {
      files: ['test/compile-templates-test.js']
    },

    lint: {
      files: ['grunt.js', 'test/compile-templates-test.js']
    },

    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true,
        evil: true
      },
      files: ['./tasks/**/*.js']
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Default task.
  grunt.registerTask('default', 'jshint compile-templates nodeunit');

};
