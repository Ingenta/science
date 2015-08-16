Package.describe({
  name: 'jackjiang:autoform-modals',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Adds bootstrap modals to update doc\'s fields from a template.',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/baidan4855/autoform-modals.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use([
      'templating'
  ],'client');

  api.addFiles([
    'autoform-modals.html',
    'autoform-modals.js'
  ],'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jackjiang:autoform-modals');
  api.addFiles('autoform-modals-tests.js');
});
