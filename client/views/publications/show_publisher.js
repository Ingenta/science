Template.PublicationList.helpers({
  publications: function () {
    return Publications.find({publisher:this._id});
  }
});

Template.imageName.helpers({
  accessKeyIs: function (accessKey) {
    return this.accessKey === accessKey;
  }
});

Template.ShowPublisher.helpers({
  setCurrentPublisher: function (id) {
    Session.set('currentPublisher', id);
  }
});

ReactiveTabs.createInterface({
  template: 'basicTabs'
});

Template.myTemplate.helpers({
  tabs: function () {
    return [
      { name: 'Journals', slug: 'journals',},
      { name: 'Collections', slug: 'collections',}
    ];
  },
  activeTab: function () {
    return Session.get('activeTab');
  }
});

AutoForm.addHooks(['addPublicationModalForm'], {
  onSuccess: function () {
    $("#addPublicationModal").modal('hide');
    FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
  },
  before:{
    insert:  function(doc){
      console.log(doc);
      doc.publisher = Session.get('currentPublisher');
      console.log(doc);
      return doc;
    }
  }
}, true);
