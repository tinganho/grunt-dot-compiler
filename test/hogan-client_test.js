
(function() {

  "use strict";

  var grunt = require('grunt');

  /*
    ======== A Handy Little Nodeunit Reference ========
    https://github.com/caolan/nodeunit

    Test methods:
      test.expect(numAssertions)
      test.done()
    Test assertions:
      test.ok(value, [message])
      test.equal(actual, expected, [message])
      test.notEqual(actual, expected, [message])
      test.deepEqual(actual, expected, [message])
      test.notDeepEqual(actual, expected, [message])
      test.strictEqual(actual, expected, [message])
      test.notStrictEqual(actual, expected, [message])
      test.throws(block, [error], [message])
      test.doesNotThrow(block, [error], [message])
      test.ifError(value)
  */

  exports.namespaced = {
    compile: function(test) {
      test.expect(2);

      var actual = grunt.file.read('test/tmp/bar.js');
      var expected = grunt.file.read('test/expected/bar.js');
      test.equal(expected, actual, 'Should compile to correct javascript format using new global variable');

      actual = grunt.file.read('test/tmp/foo.js');
      expected = grunt.file.read('test/expected/foo.js');
      test.equal(expected, actual, 'Should compile to correct javascript format using existing variable');

      test.done();
    }
  };
}());