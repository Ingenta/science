Package.describe({
  name: 'science-institution',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var both = ['client', 'server'];

Package.onUse(function(api) {
  api.versionsFrom('1.2.1')
  api.use([
    'templating',
    'iron:router',
    'aldeed:simple-schema',
    'aldeed:autoform',
    'hitchcott:paginator',
    'science-lib',
    'science-permissions',
    'templates:tabs'
  ], both);

  api.addFiles('both/institutions.js', both);
  api.addFiles('both/methods.js', both);


  api.addFiles('server/publish.js', 'server');
  api.addFiles('server/institutions.js', 'server');

  api.addFiles([
    'client/paginator.js',
    'client/router.js',
    'client/view/institutions/institutions.html',
    'client/view/institutions/institutions.js',
    'client/view/institutions/list.html',
    'client/view/institutions/list.js',
    'client/view/institutions/detail.html',
    'client/view/institutions/detail.js',
    'client/view/admin/institution.html',
    'client/view/admin/institution.js',
    'client/view/admin/institution_controller.js'
  ], 'client')
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-institution');
  api.addFiles('science-institution-tests.js');
});
