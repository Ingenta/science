Package.describe({
    name: 'science-author-center',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: '',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.2.1')
    api.use(
        [
            'templating',
            'iron:router',
            'aldeed:simple-schema',
            'science-lib',
            'science-permissions',
        ], both);

    api.addFiles('server/authorCenter.js', 'server');

    api.addFiles('science-author-center.js');
    api.addFiles('client/router.js','client');
    api.addFiles('client/views/authorCenter.html','client');
    api.addFiles('client/views/authorCenter.js','client');

});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('science-author-center');
    api.addFiles('science-author-center-tests.js');
});
