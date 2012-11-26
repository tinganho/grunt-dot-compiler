module.exports = function(grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    hoganclient: {
      namespaced: {
        options: {
          variable: 'foo.tmpl'
        },
        src: ['test/templates/**/*.hogan'],
        dest: 'test/tmp/foo.js'
      },
      global: {
        src: ['test/templates/**/*.hogan'],
        dest: 'test/tmp/bar.js'
      }
    },

    test: {
      files: ['test/hogan-client_test.js']
    },

    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
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
        es5: true
      },
      globals: {
        Hogan: true,
        foo: true
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // The clean plugin helps in testing.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Default task.
  grunt.registerTask('default', 'lint hoganclient test');

};
