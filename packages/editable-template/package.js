Package.describe({
  name: 'jackjiang:editable-template',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});
var both = ['server','client'];

Npm.depends({
  'juice':"1.6.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.4-logging.0');

  api.use([
    'mongo',
    'matb33:collection-hooks'
  ],both);

  api.use([
    'ecmascript',
    'templating',
    'reactive-var',
    'spacebars-compiler',
    'summernote:summernote',
    'kevohagan:sweetalert'
  ],'client');

  api.use([
      'meteorhacks:ssr'
  ],'server');

  //api.use('perak:codemirror');
  api.addFiles([
    'editable-template.js',
    'both/collection.js',
    'both/func.js',
    'both/initial.js'
  ],both);
  
  api.addFiles([
    'server/render.js',
    'server/collection.js'
  ],'server');

  api.addFiles([
    'client/initial.js',
    'client/func.js',
    'client/view/start.html',
    'client/view/editor.html',
    'client/view/editor.js',
    'client/view/preview.html',
    'client/view/preview.js'
  ],'client');

  api.export('JET');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jackjiang:editable-template');
  api.addFiles('editable-template-tests.js');
});
