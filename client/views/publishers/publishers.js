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
