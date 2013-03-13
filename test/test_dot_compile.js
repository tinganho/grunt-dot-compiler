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

var nodeRequirejsTmpl, requirejsTmpl, nodeTmpl;

require(findup('Gruntfile.js'))(grunt);

describe('dot-compile', function() {

  before(function(done) {
    exec('grunt dot:nodeRequirejs', function(error, stdout, stderr) {
      nodeRequirejsTmpl = requirejs('./output/tmpl');
      done();
    });
  });
  it('should be able to compile regular templates', function() {
    expect(nodeRequirejsTmpl.regular()).to.equal('<div></div>');
  });
  it('should be able to compile templates with variables', function() {
    expect(nodeRequirejsTmpl.variables({'var': 'hello' })).to.equal('<div>hello</div>');
  });
  it('should be able to compile templates with arrays', function() {
    expect(nodeRequirejsTmpl.arrays({array: ['1', '2', '3'] })).to.equal('<div>1</div><div>2</div><div>3</div>');
  });
  it('should be able to compile templates with hash maps', function() {
    expect(nodeRequirejsTmpl.hashMap({'1': '1', '2': '2', '3': '3'})).to.equal('<div>1</div><div>2</div><div>3</div>');
  });
  it('should be able to compile an htmlencode functionality', function() {
    expect(typeof String.prototype.encodeHTML === 'function').to.be.true;
  });
  it('should be able to remove comments during compile', function() {
    expect(/\/\*.*?\*\//gm.test(nodeRequirejsTmpl.comments.toString())).to.be.false;
    expect(/\/\/.*\n/g.test(nodeRequirejsTmpl.comments.toString())).to.be.false;
  });
});

describe('requirejs-only', function(){
  before(function(done) {
    exec('grunt dot:requirejs', function(error, stdout, stderr) {
      requirejsTmpl = grunt.file.read('test/output/tmpl.js');
      done();
    });
  });

  it('should not have amddefine module', function() {
    expect(/if\(typeof define/.test(requirejsTmpl.toString())).to.be.false;
  });
  it('should have a define', function() {
    expect(/define\(/.test(requirejsTmpl.toString())).to.be.true;
  });
});

describe('node-only', function(){
  before(function(done) {
    exec('grunt dot:node', function(error, stdout, stderr) {
      nodeTmpl = grunt.file.read('test/output/tmpl.js');
      done();
    });
  });

  it('should not have amddefine module', function() {
    expect(/if\(typeof define/.test(nodeTmpl.toString())).to.be.false;
  });
  it('should have a module exports', function() {
    expect(/module\.exports/.test(nodeTmpl.toString())).to.be.true;
  });
});
