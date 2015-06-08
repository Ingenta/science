ReactiveTabs.createInterface({
  template: 'journalTabs'
});

Template.journalOptions.helpers({
  context: function () {
    var currentTitle = Router.current().params.title;
    return Publications.findOne({title: currentTitle});
  },
  setCurrentPublication: function (id) {
    Session.set('currPublication', id);
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

AutoForm.addHooks(['addAboutTitleModalForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    },
    before:{
        insert:  function(doc){
            doc.publications = Session.get('currPublication');
            return doc;
        }
    }
}, true);

Template.AboutList.helpers({
  about: function () {
    return About.find();
  }
});