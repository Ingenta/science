Package.describe({
  name: 'science-reports',
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

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use([
        'templating',
        'iron:router',
        'science-lib',
        'science-permissions'
    ], both);

    api.addFiles('both/collections.js', both);
    api.addFiles('both/method.js', both);


    api.addFiles('server/publish.js', 'server');
    api.addFiles('server/collection.js', 'server');

    api.addFiles([
        'client/view/reports.html',
        'client/view/reports.js',
        'client/router.js'
    ], 'client')
});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('science-reports');
    api.addFiles('science-reports-tests.js');
});