Package.describe({
    name: 'science-logger',
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
    "winston": "2.1.0",
    "winston-mongodb": "1.1.1"
});
Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    api.use('ecmascript');
    api.addFiles('science-logger.js');
    api.export("logger", "server");
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('science-logger');
    api.addFiles('science-logger-tests.js');
});
