Package.describe({
  name: 'science-search',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.3');

  api.use([
    'iron:router',
    'science-lib'
  ]);

  api.use('jackjiang:solr','server');

  api.use([
    'templating',
    'reactive-var',
    'rochal:slimscroll'
  ],'client');


  api.addFiles([
    'server/solr.js',
    'server/methods.js',
    'server/hooks.js',
    'server/ajax.js'
  ],'server');

  api.addFiles([
    'client/query.js',
    'client/router.js',
    'client/view/quickSearch.html',
    'client/view/quickSearch.js',
    'client/view/search.html',
    'client/view/search.js',
    'client/view/oneArticle.html',
    'client/view/oneArticle.js',
    'client/view/filters.html',
    'client/view/filters.js',
    'client/view/selectionSearch.html',
    'client/view/selectionSearch.js',
    'client/view/advSearch.html',
    'client/view/advSearch.js',
    'client/view/secSearch.html',
    'client/view/secSearch.js',
    'client/view/topics.html',
    'client/view/topics.js',
    'client/view/pagination.html',
    'client/view/pagination.js',
    'client/view/stylesheets/search.css',
    'client/utils.js',
    'client/view/component/articleSelector.html',
    'client/view/component/articleSelector.js'
  ],'client');

  api.export('SolrQuery','client');
  api.export('SolrClient','server');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-search');
});
