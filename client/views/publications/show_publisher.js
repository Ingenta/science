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


Template.SinglePublication.helpers({
  getJournalUrl: function () {
    return "/publishers/abc/journals/banana";
  },
  getPublisherNameById: function (id) {
    return Publishers.findOne({_id:id}).name;
  }
});

AutoForm.addHooks(['addPublicationModalForm'], {
  onSuccess: function () {
    $("#addPublicationModal").modal('hide');
    FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
  },
  before:{
    insert:  function(doc){
      doc.publisher = Session.get('currentPublisher');
      doc.firstletter=doc.firstletter.toUpperCase();
      return doc;
      //TODO: fix update bug not setting uppercase
    }
  }
}, true);
