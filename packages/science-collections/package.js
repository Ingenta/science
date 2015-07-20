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
      'aldeed:simple-schema',
      'aldeed:autoform',
      'science-lib',
      'science-permissions'
  ],both);

  api.addFiles('both/collection.js',both);
  api.addFiles('server/publish.js','server');

  api.addFiles([
      'client/router.js',
      'client/view/collections.html',
      'client/view/collections.js',
      'client/view/list.html',
      'client/view/list.js',
      'client/view/filters/collAlphabetBar.html',
      'client/view/filters/collAlphabetBar.js',
      'client/view/filters/collLeftFilters.html',
      'client/view/filters/collLeftFilters.js',
      'client/view/filters/collPublishersFilter.html',
      'client/view/filters/collPublishersFilter.js'
  ],'client')
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-collections');
  api.addFiles('science-collections-tests.js');
});
