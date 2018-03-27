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
  api.versionsFrom('1.2.1');

  api.use([
      'templating',
      'iron:router',
      'science-lib',
      'cfs:power-queue',
      'science-external-interface',
      'percolate:synced-cron@1.2.2',
      'cfs:micro-queue',
      'cfs:reactive-list'
  ],both);

  api.addFiles([
      'both/collection.js'
  ],both);

  api.addFiles([
      'server/queue.js',
      'server/publish.js',
      'server/cron.js',
      'server/metricsQueue.js',
      'server/cronTasks/Postman.js',
      'server/cronTasks/FTPScan.js',
      'server/cronTasks/DOIRegister.js',
      'server/cronTasks/CitationUpdate.js',
      'server/cronTasks/mostCount.js',
      'server/cronTasks/volumeYear.js',
      'server/cronTasks/MetricsUpdate.js'
  ],'server');

  api.addFiles([
      'client/route.js',
      'client/view/autoTasks.html',
      'client/view/autoTasks.js',
      'client/view/progressBar.html',
      'client/view/progressBar.js',
      'client/view/doi/list.html',
      'client/view/doi/list.js',
      'client/view/citation/list.html',
      'client/view/citation/list.js'
  ],'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-auto-task');
  api.addFiles('science-auto-task-tests.js');
});
