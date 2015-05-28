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

Template.ShowPublisher.helpers({
  getImage: function (pictureId) {
    var noPicture ="http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg"
    if(pictureId===undefined)
      return noPicture;
    return Images.findOne({_id: pictureId}).url();
  },
  isChinese: function(l){
    if(l==="zh-CN")
      return true;
    return false;
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
