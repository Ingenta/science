Package.describe({
    name: 'science-xml',
    version: '0.0.1',
    summary: 'Upload and parse xml into article mongodb documents',
    git: '',
    documentation: 'README.md'
});
both = ['client','server']
Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use(
        [
            'templating',
            'jackkav:xpath',
            'science-lib'
        ],
        both);
    api.addFiles('both/routes.js',both);
    api.addFiles('both/uploadLog.js', both);
    api.addFiles('server/science-xml.js', 'server');
    api.addFiles('server/parse.js', 'server');
    api.addFiles('server/tasks.js', 'server');
    api.addFiles('server/xml-lib.js', 'server');
    api.addFiles('client/views/upload.html', 'client');
    api.addFiles('client/views/upload.js', 'client');
    api.export('ScienceXML');
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('science-xml', 'server');
    api.use('jackkav:xpath', 'server');
    api.addFiles('science-xml-tests.js', 'server');
});
