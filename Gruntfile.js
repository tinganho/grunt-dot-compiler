module.exports = function(grunt) {

  "use strict";

  // Project configuration.
  grunt.initConfig({

    dot: {
      nodeRequirejs: {
        options: {
            variable:  'tmpl',
            node:      true,
            requirejs: true
        },
        src: ['test/example/**/*.dot'],
        dest: 'test/output/tmpl.js'
      },

      requirejs: {
        options: {
            variable: 'tmpl',
            node:      false,
            requirejs: true
        },
        src: ['test/example/**/*.dot'],
        dest: 'test/output/tmpl.js'
      },

      node: {
        options: {
            variable: 'tmpl',
            node:      true,
            requirejs: false
        },
        src: ['test/example/**/*.dot'],
        dest: 'test/output/tmpl.js'
      },

      regular: {
        options: {
            variable: 'tmpl.test'
        },
        src: ['test/example/**/*.dot'],
        dest: 'test/output/tmpl.js'
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
  grunt.registerTask('default', 'jshint dot nodeunit');

};
