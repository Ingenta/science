Package.describe({
  name: 'science-permissions',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('underscore');
  api.use('orbit:permissions');
  api.addFiles('publication.js',['server']);
  api.addFiles('science-permissions.js',['server','client']);
  api.addFiles('group/system.js',['server','client']);
  api.addFiles('group/user.js',['server','client']);

  api.export(["Permissions"]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-permissions');
  api.addFiles('science-permissions-tests.js');
});
