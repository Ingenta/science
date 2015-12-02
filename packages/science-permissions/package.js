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

both = ['server','client'];

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use('underscore');
  api.use('orbit:permissions');
  api.addFiles('publication.js',['server']);
  api.addFiles('method.js',both);

  api.addFiles('science-permissions.js',both);
  api.addFiles('group/user.js',both);
  api.addFiles('group/publisher.js',both);
  api.addFiles('group/resource.js',both);
  api.addFiles('group/topic.js',both);
  api.addFiles('group/news.js',both);
  api.addFiles('group/platform.js',both);
  api.addFiles('group/collections.js',both);
  api.addFiles('group/institution.js',both);
  api.addFiles('group/advertisement.js',both);
  api.addFiles('group/publication.js',both);
  api.addFiles('group/specialIssue.js',both);

  api.export(["Permissions"]);
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-permissions');
  api.addFiles('science-permissions-tests.js');
});
