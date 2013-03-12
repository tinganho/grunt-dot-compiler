# grunt-dot-compiler [![Build Status](https://travis-ci.org/tinganho/grunt-dot-compiler.png)](https://travis-ci.org/tinganho/grunt-dot-compiler)

> Compiles doT templates ready for RequireJS

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-dot-compiler`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-dot-compiler');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Example
given the following config and template
### config
```javascript
  'compile-templates': {
    dist: {
      options: {
        variable: 'tmpl'
      },
      src: ['app/**/*.dot'],
      dest: 'app/public/templates/tmpl.js'
    }
  }
```
### templates
#### templates/item.dot
```html
<li>
  <a>{{=it.url}}<a>
</li>
```

will output the following script file
#### dist/tmpl.js
```javascript
if( typeof define !== "function" ) {
  define = require( "amdefine" )( module )
}
define(function() {
  var tmpl=tmpl|| {};
  tmpl['item']=function anonymous(it) {
    var out='<li><a href="'+(it.url)+'"></a></li>';return out;
  }
  return tmpl;
});
```

## Release History
* 0.2.0 - Forked from https://github.com/ullmark/grunt-hogan-client to make generic.
* 0.1.1 - Initial release

## License
Copyright (c) 2012 Tingan Ho
Licensed under the MIT license.
