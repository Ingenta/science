Template.PublisherList.helpers({
    publishers: function () {
      return Publishers.find();
    },
    selectedPublisherDoc: function () {
    return Publishers.findOne();
  }
  });

Template.Publishers.rendered = function() {
};

AutoForm.addHooks(['cmForm'], {
    onSuccess: function () {
      FlashMessages.sendSuccess("Success!", { hideDelay: 2000 });
    }
  }, true);
