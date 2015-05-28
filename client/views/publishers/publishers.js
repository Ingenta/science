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
Template.showImage.helpers({
    getImage: function (pictureId) {
      var noPicture ="http://scitation.aip.org/docserver/fulltext/aippublogo_103px.jpg"
      if(pictureId===undefined)
          return noPicture;
        
      console.log(pictureId);
         console.log(Images.findOne({_id: pictureId}).url());
    }
  });

Template.Publishers.rendered = function() {
};

AutoForm.addHooks(['cmForm'], {
    onSuccess: function () {
      FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    }
  }, true);
