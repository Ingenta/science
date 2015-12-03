Package.describe({
    name: 'science-topics',
    version: '0.0.1',
    // Brief, one-line summary of the package.
    summary: 'a page of editable topics and subtopics derived from the database',
    // URL to the Git repository containing the source code for this package.
    git: 'https://github.com/jackkav/science',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

both = ['client', 'server']

Package.onUse(function (api) {
    api.versionsFrom('1.1.0.2');
    api.use(
        [
//            'templating',
//
//            'aldeed:autoform'

            'templating',
            'iron:router',
            'aldeed:simple-schema',
            'aldeed:autoform',
            'hitchcott:paginator',
            'science-lib',
            'science-permissions',
            'templates:tabs'

        ],
        both);

    api.addFiles('topics.js', both);
    api.addFiles('client/router.js','client');
    api.addFiles('client/views/addArticlesForTopics.html', 'client');
    api.addFiles('client/views/topicsDetail/detail.html', 'client');
    api.addFiles('client/views/topicsDetail/detail.js', 'client');
    api.addFiles('client/views/tabs.html', 'client');
    api.addFiles('client/views/tabs.js', 'client');
    api.addFiles('client/views/solrSelector.html', 'client');
    api.addFiles('client/views/solrSelector.js', 'client');
    api.addFiles('client/views/inside/list.html', 'client');
    api.addFiles('client/views/inside/list.js', 'client');
    api.addFiles('client/views/select/query.html', 'client');
    api.addFiles('client/views/select/query.js', 'client');
    api.addFiles('client/views/select/result.html', 'client');
    api.addFiles('client/views/select/result.js', 'client');
    api.addFiles('client/views/topics.html', 'client');
    api.addFiles('client/views/topics.js', 'client');
    api.addFiles('client/views/topics.css', 'client');
});

Package.onTest(function (api) {
    api.use('tinytest');
    api.addFiles('science-topics-tests.js');
});
