Package.describe({
  name: 'science-emails',
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
  api.versionsFrom('1.1.0.3');
    api.use(
        [
            'templating',
            'iron:router',
            'aldeed:simple-schema',
            'science-lib',
            'science-permissions',
        ],both);

    api.addFiles('server/emails.js', 'server');

    api.addFiles('science-emails.js');
    api.addFiles('client/router.js','client');
    api.addFiles('client/views/emails.html','client');
    api.addFiles('client/views/emails.js','client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-emails');
  api.addFiles('science-emails-tests.js');
});