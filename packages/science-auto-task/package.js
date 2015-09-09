Package.describe({
  name: 'science-auto-task',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

var both=['server','client'];

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use([
      'templating',
      'iron:router',
      'science-lib',
      'cfs:power-queue',
      'science-external-interface',
      'percolate:synced-cron'
  ]);

  api.addFiles([
      'both/collection.js'
  ],both);

  api.addFiles([
      'server/queue.js',
      'server/publish.js',
      'server/cron.js'
  ],'server');

  api.addFiles([
      'client/route.js',
      'client/view/autoTask.html',
      'client/view/autoTask.js',
      'client/view/doi/list.html',
      'client/view/doi/list.js',
      'client/view/citation/list.html',
      'client/view/citation/list.js',
      'client/view/progressBar.html',
      'client/view/progressBar.js'
  ],'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-auto-task');
  api.addFiles('science-auto-task-tests.js');
});