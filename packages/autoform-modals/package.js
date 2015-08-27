Package.describe({
  name: 'yogiben:autoform-modals-up',
  summary: "Create, update and delete collections with modals",
  version: "0.3.7",
  git: "https://github.com/yogiben/meteor-autoform-modals"
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@1.0');

  api.use([
    'jquery',
    'templating',
    'less',
    'session',
    'coffeescript',
    'ui',
    'aldeed:autoform@5.3.1',
    'raix:handlebar-helpers@0.2.4',
    'mpowaga:string-template@0.1.0'
  ], 'client');

  api.addFiles([
    'lib/client/modals.html',
    'lib/client/modals.js',
    'lib/client/modals.less'
    ],'client');
});
