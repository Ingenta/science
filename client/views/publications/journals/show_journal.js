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
    return [
    { name: TAPi18n.__("Overview"), slug: 'overview' },
    { name:  TAPi18n.__("Browse"), slug: 'browse' },
    { name:  TAPi18n.__("About"), slug: 'about' },
    ];
  },
  activeTab: function () {
    return Session.get('activeTab');
  }
});

Template.ShowPublisher.helpers({
  setCurrentPublisher: function (id) {
    Session.set('currentPublisher', id);
  }
});

AutoForm.addHooks(['editAboutTitleModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    },
    before:{
        insert:  function(doc){
            console.log(doc);
            doc.publications = Session.get('publications');
            console.log(doc);
            return doc;
        }
    }
}, true);