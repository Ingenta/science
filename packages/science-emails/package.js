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
    api.versionsFrom('1.2.1')
    api.use(
        [
            'templating',
            'iron:router',
            'aldeed:simple-schema',
            'science-lib',
            'science-permissions',
            'aldeed:autoform',
        ],both);

    api.addFiles('server/main.js', 'server');
    api.addFiles('server/emails.js', 'server');

    api.addFiles('client/router.js','client');
    api.addFiles('client/views/admin/emails.html','client');
    api.addFiles('client/views/admin/emails.js','client');
});

