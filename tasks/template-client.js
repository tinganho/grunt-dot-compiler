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

	grunt.registerMultiTask('templateclient', 'prepares and combines any type of template into a script include', function() {
		// grap the filepattern
		var files = grunt.file.expandFiles(this.file.src);
		// create the hogan include
		var src = grunt.helper('templateclient', files, this.data.options);
		// write the new file
		grunt.file.write(this.file.dest, src);
		// log our success
		grunt.log.writeln('File "' + this.file.dest + '" created.');
	});

	// ==========================================================================
	// HELPERS
	// ==========================================================================

	grunt.registerHelper('templateclient', function(files, options) {
		var src = '';

		options = grunt.utils._.defaults(options || {}, {
			variable: 'window.tmpl',
			prefix: 'Hogan.compile(',
			suffix: ')'
		});

		src += '(function compileTemplates() {' + grunt.utils.linefeed;
		src += '	' + options.variable + '=' + options.variable + '||{};' + grunt.utils.linefeed;

		files.map(function(filepath) {
			var name = path.basename(filepath, path.extname(filepath));
			var file = grunt.file.read(filepath).replace(cleaner, '').replace(/'/, '\'');
			src += '	' + options.variable + '.' + name + '='+options.prefix+'\'' + file + '\''+options.suffix+';' + grunt.utils.linefeed;
		});

		src += '}());' + grunt.utils.linefeed;

		return src;
	});

};
