(function compileTemplates() {
  window.tmpl=window.tmpl||{};
  window.tmpl.bar=Hogan.compile('<div class="something"><ul>{{#foo}}<li><h1>{{bar}}</h1></li>{{/foo}}</ul></div>');
  window.tmpl.foo=Hogan.compile('<div class="something"><ul>{{#foo}}<li><h1>{{bar}}</h1></li>{{/foo}}</ul></div>');
}());
