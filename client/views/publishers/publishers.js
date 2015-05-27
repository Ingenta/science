Template.PublisherList.helpers({
    publishers: function () {
      return Publishers.find();
    }
  });

Template.Publishers.rendered = function() {
};

AutoForm.addHooks(['cmForm'], {
    onSuccess: function () {
      FlashMessages.sendSuccess("Success!", { hideDelay: 5000 });
    }
  }, true);
