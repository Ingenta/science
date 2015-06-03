ReactiveTabs.createInterface({
  template: 'journalTabs'
});

Template.journalOptions.helpers({
  context: function () {
    var currentTitle = Router.current().params.title;
    return Publications.findOne({title: currentTitle});
  }
});

Template.journalOptions.helpers({
  tabs: function () {
    // Every tab object MUST have a name and a slug!
    return [
    { name: 'Overview', slug: 'overview' },
    { name: 'Browse', slug: 'browse' },
    { name: 'About', slug: 'about' },
    ];
  },
  activeTab: function () {
      return Session.get('activeTab');
  }
});

