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
            'jackkav:xpath'
        ],
        both);
    api.addFiles('both/uploadLog.js', both);
    api.addFiles('server/science-xml.js', 'server');
    api.addFiles('client/views/upload.html', 'client');
    api.addFiles('client/views/upload.js', 'client');
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('science-xml');
    api.addFiles('science-xml-tests.js');
});
