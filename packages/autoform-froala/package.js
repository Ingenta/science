Package.describe({
  name: 'jackjiang:autoform-froala',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "busboy":"0.2.9"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('ecmascript');
  api.use([
    'reactive-var',
    'froala:editor@2.2.4',
    'templating',
    'aldeed:autoform'
  ],'client');
  api.use([
    'iron:router'
  ],'server');
  api.addFiles(['afFroalaEditor.html','afFroalaEditor.js','stylesheet.css'],'client');
  api.addFiles(['upload.js'],'server'); // there is a bug with Router.onBeforeAction
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jackjiang:autoform-froala');
});
