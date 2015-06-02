Template.PublisherList.helpers({
  publishers: function () {
    return Publishers.find();
  }
});

Template.deletePublisherModalForm.helpers({
  getPrompt: function () {
    return TAPi18n.__("Are you sure?");
  }
});
Template.SinglePublisher.helpers({
  getImage: function (pictureId) {
    var noPicture ="http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg"
    if(pictureId===undefined)
      return noPicture;
    return Images.findOne({_id: pictureId}).url();
  }
});
Template.showImage.helpers({
  getImage: function (pictureId) {
    var noPicture ="http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg"
    if(pictureId===undefined)
      return noPicture;
    return Images.findOne({_id: pictureId}).url();
  }
});
AutoForm.addHooks(['addPublisherModalForm'], {
  onSuccess: function () {
    $("#addPublisherModal").modal('hide');
    FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
  }
}, true);

AutoForm.addHooks(['cmForm'], {
  onSuccess: function () {
    FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
  }
}, true);
