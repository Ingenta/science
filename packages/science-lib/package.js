Package.describe({
  name: 'science-lib',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Npm.depends({
  "fs-extra": "0.24.0",
  "request": "2.61.0"
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  //最好能在引用的包后面加上版本号，以免系统自动更新新版本的包，造成不稳定的情况
  var packages=[
    'templating',
    'meteor-platform',
    'standard-app-packages',
    'dburles:collection-helpers@1.0.3',
    'reactive-dict',
    'iron:router@1.0.9',
    'matb33:collection-hooks@0.7.11',
    'aldeed:simple-schema@1.1.0',
    'underscore'
  ];
  api.use(packages);

  api.imply(packages);

  api.addFiles([
    'lib/core.js',
    'lib/string_utils.js',
    'lib/dateUtils.js',
    'lib/schema.js',
    'both/schema/multiLang.js'
  ],['server','client']);

  api.addFiles([
    'lib/fileUtils.js',
    'lib/httpUtils.js'
  ],'server');
  api.export(
      'Science'
  )
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-lib');
  api.addFiles('science-lib-tests.js');
});
