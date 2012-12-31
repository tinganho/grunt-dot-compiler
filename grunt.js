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

    test: {
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
        es5: true
      },
      globals: {
        dot: true,
        foo: true,
        window: true
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bump');

  // Default task.
  grunt.registerTask('default', 'lint compile-templates test');

  // Default task.
  grunt.registerTask('jshint');

};
