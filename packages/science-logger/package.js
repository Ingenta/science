Package.describe({
    name: 'science-logger',
    version: '0.0.2',
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
