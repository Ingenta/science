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

Template.Publishers.rendered = function() {
};

AutoForm.addHooks(['cmForm'], {
    onSuccess: function () {
      FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    }
  }, true);
