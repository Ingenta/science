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

Template.updatePublisherModalForm.helpers({
  getTitle: function () {
    return TAPi18n.__("Update");
  }
});

Template.SinglePublisher.helpers({
    hasPublisher: function (id) {
        return  Publications.find({"publisher": id}).count()===0;
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
