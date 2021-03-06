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
    "request": "2.61.0",
    "readline": "1.0.0",
    "xml2js": "0.4.11",
    "xss": "0.2.7"
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1');
    //最好能在引用的包后面加上版本号，以免系统自动更新新版本的包，造成不稳定的情况
    var packages = [
        'templating',
        'meteor-platform',
        'standard-app-packages',
        'reactive-dict',
        'iron:router',
        'matb33:collection-hooks',
        'aldeed:simple-schema',
        'aldeed:autoform@5.8.1',
        'aldeed:collection2',
        'underscore',
        'jackkav:xpath',
        'mrt:cookies',
        'meteorhacks:ssr',
        'science-logger'
    ];
    api.use(packages,['server', 'client']);

    api.use('cfs:power-queue','server');

    api.imply(packages);
    api.addAssets('pdf.jar', 'server');
    api.addFiles([
        'lib/0_config.js',
        'lib/core.js',
        'lib/string_utils.js',
        'lib/jsonUtils.js',
        'lib/dateUtils.js',
        'both/schema/multiLang.js',
        'both/schema/accordion.js',
        'both/url.js'
    ], ['server', 'client']);

    api.addFiles([
        'lib/fileUtils.js',
        'lib/httpUtils.js',
        'lib/xpathUtils.js',
        'lib/xss.js',
        'lib/pdf.js',
        'lib/SSR.js',
        'lib/data.js',
        'lib/thumbUtils.js'
    ], 'server');

    api.addFiles([
        'lib/dom.js',
        'lib/cookieUtils.js'
    ], 'client');

    api.export(
        [
            'Science',
            'Config'
        ]
    )
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('science-lib');
    api.addFiles('science-lib-tests.js');
});
