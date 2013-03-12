var chai      = require( 'chai' ),
    expect    = chai.expect,
    grunt     = require('grunt'),
    findup    = require('findup-sync'),
    requirejs = require('requirejs'),
    exec      = require('child_process').exec;

// RequireJS settings
requirejs.config({
  baseUrl: __dirname,
  nodeRequire: require
});



var tmpl = requirejs('./output/tmpl');

require(findup('Gruntfile.js'))(grunt);

describe('dot-compile', function() {

  before(function(done) {
    exec('grunt dot-compile', function(error, stdout, stderr) {
      exec('grunt dot-compile', function(error, stdout, stderr) {
        console.log('Compiling templates');
        done();
      });
    });
  });

  it('should be able to compile regular templates', function() {
    expect(tmpl.regular()).to.equal('<div></div>');
  });
  it('should be able to compile templates with variables', function() {
    expect(tmpl.variables({'var': 'hello' })).to.equal('<div>hello</div>');
  });
  it('should be able to compile templates with arrays', function() {
    expect(tmpl.arrays({array: ['1', '2', '3'] })).to.equal('<div>1</div><div>2</div><div>3</div>');
  });
  it('should be able to compile templates with hash maps', function() {
    expect(tmpl.hashMap({'1': '1', '2': '2', '3': '3'})).to.equal('<div>1</div><div>2</div><div>3</div>');
  });
  it('should be able to compile an htmlencode functionality', function() {
    expect(typeof String.prototype.encodeHTML === 'function').to.be.true;
  });
});
