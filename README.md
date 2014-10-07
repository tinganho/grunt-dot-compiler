# grunt-dot-compiler [![Build Status](https://travis-ci.org/tinganho/grunt-dot-compiler.png)](https://travis-ci.org/tinganho/grunt-dot-compiler)

Compiles doT templates ready for RequireJS

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
  dot: {
    dist: {
      options: {
        variable : 'tmpl',
        root     : __dirname + '/app/profiles'
      },
      src  : ['app/**/*.dot'],
      dest : 'app/public/templates/tmpl.js'
    }
  }
```

### Options
* variable String Variable to store everything
* root String Root of the project
* requirejs Boolean Enable RequireJS
* node Boolean Enable Node

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

### Partials
You can load partials with the `load` command
```javascript
  {{##def.partial1: load('./partial1.part') #}} // Use relative paths
  {{##def.partial2: load('test/example/partial2.part') #}} // Use options.root
  
  <div>
    {{#def.partial1}}
    {{#def.partial2}}
  </div>
```

#### New in version 0.5
Have you ever wondered if you can set customize CSS classes in partials without doing it right in a Javascript file, instead doing right on the template?

With version 0.4 you can set `in-template-vars`. Which means, when you load a partial you can set specific variables right in the template.

Define in-template-vars with the following syntax:

`{{$ VARIABLE_NAME:DEFAULT_VALUE }}`// ":DEFAULT_VALUE" is optional

For instance, in test.part:
```html

<div class="{{$ some:some-var }}"></div>
```
Load the partial now in test.dot

```html
{{##def.customPartial: load('./test.part', { some : 'some-css-class'}) #}}

{{#def.customPartial}}
```
And the output will be:
```html
<div class="some-css-class"></div>
```
#### Partials-in-partials
You can now create partials in partials and Grunt-dot-compiler will do the mgic for you.

## License
Copyright (c) 2012 Tingan Ho
Licensed under the MIT license.
