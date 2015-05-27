Template.PublicationList.helpers({
  publications: function () {
    return Publications.find({publisher:this.urlname});
  }
});

Template.imageName.helpers({
  accessKeyIs: function (accessKey) {
    return this.accessKey === accessKey;
  }
});

Template.ShowPublisher.helpers({
  setCurrentPublisher: function (urlname) {
    Session.set('currentPublisher', urlname);
  }
});

AutoForm.addHooks(['addPublicationForm'], {
  onSuccess: function () {
    FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
  },
  before:{
    insert:  function(doc){
      doc.publisher = Session.get('currentPublisher');
      return doc;
    }
  }
}, true);
