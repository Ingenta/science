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

Package.onUse(function(api) {
  api.versionsFrom('1.2.0.4-logging.0');
  api.use([
    'ecmascript',
    'templating',
    'spacebars-compiler'
  ],'client');

  api.addFiles([
    'editable-template.js'
  ],both);

  api.addFiles([
    'client/editor.html',
    'client/editor.js',
    'client/preview.html',
    'client/preview.js'
  ],'client');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('jackjiang:editable-template');
  api.addFiles('editable-template-tests.js');
});
