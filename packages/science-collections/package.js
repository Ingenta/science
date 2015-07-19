Package.describe({
  name: 'science-collections',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var both = ['client','server'];

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use([
      'templating',
      'iron:router',
      'science-lib'
  ],both);
  api.addFiles('both/collection.js',both);
  api.addFiles('both/router.js',both);

  api.addFiles([
      'client/view/list.html',
      'client/view/list.js'
  ],'client')
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-collections');
  api.addFiles('science-collections-tests.js');
});