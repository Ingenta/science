Package.describe({
    name: 'arthuryyx:ftp',
    version: '0.3.10',
    // Brief, one-line summary of the package.
    summary: 'Wrapper for npm ftp package',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Npm.depends({
    "ftp": "0.3.10",
    "fs-extra": "0.22.1"
});

Package.onUse(function (api) {
    api.use([
        'science-lib'
    ],'server')

    api.versionsFrom('1.1.0.2');
    api.addFiles('ftp.js', 'server');
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.use('arthuryyx:ftp');
    api.addFiles('ftp-tests.js', 'server');
});
