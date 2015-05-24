Template.PublicationList.helpers({
    publications: function () {
      return Publications.find();
  }
});
Template.PublisherWebsite.rendered = function() {
};
