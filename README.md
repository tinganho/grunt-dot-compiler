# grunt-template-client

> Compile any and all templates into a ready to use script include.

## Getting Started
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-template-client`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.loadNpmTasks('grunt-template-client');
```

[grunt]: http://gruntjs.com/
[getting_started]: https://github.com/gruntjs/grunt/blob/master/docs/getting_started.md

## Example
given the following config and template
### config
```javascript
  templateclient: {
    dist: {
		options: {
			variable: 'window.tmpl',
			prefix: 'Hogan.compile(',
			suffix: ')'
		},
		src: ['templates/**/*.hogan'],
		dest: 'dist/tmpl.js' 
    }
  }
```
### templates
#### templates/item.hogan
```html
<li>
  <h2>{{title}}<h2>
  <p>{{text}}</p>
</li>
```
#### templates/list.hogan
```html
<ul id="a-list">
{{#items}}
  {{>item}}
{{/items}}
</ul>
```

will output the following script file
#### dist/tmpl.js
```javascript
(function compileTemplates() {
  window.tmpl=window.tmpl||{};
  tmpl.item=Hogan.compile('<li><h2>{{title}}</h2><p>{{text}}</p></li>');
  tmpl.list=Hogan.compile('<ul id="a-list">{{#items}}{{>item}}{{/items}}</ul>');
}());
```
ready to use/include/concat etc in your app like this.

```javascript
tmpl.list.render({ items: [] });
```

## Todo
I guess there will be need to tweek the regex that cleans the template.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].

## Release History
* 0.2.0 - Forked from https://github.com/ullmark/grunt-hogan-client to make generic.
* 0.1.1 - Initial release

## License
Copyright (c) 2012 Markus Ullmark  
Licensed under the MIT license.
