Template.PublicationList.helpers({
    publications: function () {
      return Publications.find();
  }
});
Template.PublisherWebsite.rendered = function() {
};
Template.imageName.helpers({
  accessKeyIs: function (accessKey) {
    return this.accessKey === accessKey;
  }
});

