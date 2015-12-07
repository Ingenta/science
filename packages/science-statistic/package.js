Package.describe({
    name: 'science-statistic'
});
var both = ['client', 'server'];
Package.onUse(function (api) {
    api.versionsFrom('1.1.0.3');
    api.use([
        'templating',
        'iron:router',
        'science-lib',
        'science-permissions',
        'nicolaslopezj:excel-export'
    ], both);

    api.addFiles(['server/router.js',
        'server/reports.js',
        'server/reports/article.js',
        'server/reports/institution.js',
        'server/reports/journal.js',
        'server/reports/keyword.js',
        'server/reports/region.js',
        'server/reports/user.js'
    ], 'server');

    api.addFiles([
        'client/view/statistic.html',
        'client/view/statistic.js',
        'client/view/site-reports/reports.html',
        'client/view/site-reports/reports.js',
        'client/router.js'
    ], 'client')
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('science-statistic');
    api.addFiles('science-statistic-tests.js');
});
