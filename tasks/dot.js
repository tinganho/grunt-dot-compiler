/**
 * Module dependencies.
 */

var path = require('path'),
    Compiler = require('../src/Compiler');

/*
 * Export grunt task
 */

module.exports = function (grunt) {
    'use strict';

    grunt.registerMultiTask('dot', 'prepares and combines any type of template into a script include', function () {
        var options = this.options();
        options.gruntRoot = path.dirname(grunt.file.findup('Gruntfile.js')) + '/';

        this.files.forEach(function (file) {
            var compiler, src, existingSrcFiles;

            existingSrcFiles = file.src.filter(function (_file) {
                return grunt.file.exists(_file);
            });

            //Write joined contents to destination filepath
            compiler = new Compiler(options);
            src = compiler.compileTemplates(existingSrcFiles);

            grunt.file.write(file.dest, src);
            grunt.log.writeln('File "' + file.dest + '" created.');
        });
    });
};
