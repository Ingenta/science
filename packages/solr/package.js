Package.describe({
  name: 'jackjiang:solr',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Solr module for Node.js',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "solr": "0.3.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');
  api.addFiles('solr.js','server');
  api.export('Solr','server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('jackjiang:solr');
  api.addFiles('solr-tests.js');
});