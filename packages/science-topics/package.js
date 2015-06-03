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

both = ['client','server']

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
    api.use(
    [
      'templating',

      'aldeed:autoform'

    ],
    both);

  api.addFiles('topics.js', both);
  api.addFiles('client/views/topics.html', 'client');
  api.addFiles('client/views/topics.js', 'client');
  api.addFiles('client/views/topics.css', 'client');
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('science-topics');
  api.addFiles('science-topics-tests.js');
});
