Package.describe({
  name: 'templates:tabs',
  summary: 'Reactive tabbed interfaces compatible with routing.',
  version: '2.2.2',
  git: 'https://github.com/meteortemplates/tabs.git'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1.0');
  api.use([
    'templating',
    'tracker',
    'check',
    'coffeescript'
  ], 'client');
  api.addFiles('templates_tabs.html', 'client');
  api.addFiles('templates_tabs.coffee', 'client');
  api.addFiles('templates_tabs.css', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('templates:tabs');
  api.addFiles('templates_tabs-tests.js');
});
