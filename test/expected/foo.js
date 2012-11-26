foo.tmpl={};
foo.tmpl.bar=Hogan.compile('<div class="something"><ul>{{#foo}}<li><h1>{{bar}}</h1></li>{{/foo}}</ul></div>');
foo.tmpl.foo=Hogan.compile('<div class="something"><ul>{{#foo}}<li><h1>{{bar}}</h1></li>{{/foo}}</ul></div>');