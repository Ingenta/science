Package.describe({
	name         : 'science-collections',
	version      : '0.0.1',
	// Brief, one-line summary of the package.
	summary      : '',
	// URL to the Git repository containing the source code for this package.
	git          : '',
	// By default, Meteor will default to using README.md for documentation.
	// To avoid submitting documentation, set this field to null.
	documentation: 'README.md'
});

var both = ['client', 'server'];

Package.onUse(function (api) {
	api.versionsFrom('1.1.0.2');
	api.use([
		'templating',
		'iron:router',
		'aldeed:simple-schema',
		'aldeed:autoform',
		'hitchcott:paginator',
		'science-lib',
		'science-permissions',
		'templates:tabs'
	], both);

	api.addFiles('both/collection.js', both);
	api.addFiles('both/methods.js', both);


	api.addFiles('server/publish.js', 'server');
	api.addFiles('server/collection.js', 'server');

	api.addFiles([
		'client/stylesheet/collection.css',
		'client/paginator.js',
		'client/router.js',
		'client/view/collectionsList/collections.html',
		'client/view/collectionsList/collections.js',
		'client/view/collectionsList/list.html',
		'client/view/collectionsList/list.js',
		'client/view/collectionsList/filters/collAlphabetBar.html',
		'client/view/collectionsList/filters/collAlphabetBar.js',
		'client/view/collectionsList/filters/collLeftFilters.html',
		'client/view/collectionsList/filters/collLeftFilters.js',
		'client/view/collectionsList/filters/collPublishersFilter.html',
		'client/view/collectionsList/filters/collPublishersFilter.js',
		'client/view/articleSelector/solrSelector.html',
		'client/view/articleSelector/solrSelector.js',
		'client/view/articleSelector/tabs.html',
		'client/view/articleSelector/tabs.js',
		'client/view/articleSelector/addArticle.html',
		'client/view/articleSelector/addArticle.js',
		'client/view/articleSelector/select/query.html',
		'client/view/articleSelector/select/query.js',
		'client/view/articleSelector/select/result.html',
		'client/view/articleSelector/select/result.js',
		'client/view/articleSelector/inside/list.html',
		'client/view/articleSelector/inside/list.js',
		'client/view/collectionDetail/detail.html',
		'client/view/collectionDetail/detail.js'
	], 'client')
});

Package.onTest(function (api) {
	api.use('tinytest');
	api.use('science-collections');
	api.addFiles('science-collections-tests.js');
});
