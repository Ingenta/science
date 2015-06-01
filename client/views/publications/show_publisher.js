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
  getImage: function (pictureId) {
    var noPicture ="http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg"
    if(pictureId===undefined)
    return noPicture;
    return Images.findOne({_id: pictureId}).url();
  },
  getPublisherNameById: function (id) {
    return Publishers.findOne({_id:id}).name;
  },
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
