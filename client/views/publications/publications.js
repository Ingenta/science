Template.PublicationsList.helpers({
    publications: function () {
      return Publications.find();
  }
});

Template.PublishersList.helpers({
    publishers: function () {
		console.log(this);
      return Publishers.find();
    }
  });

  Template.imageName.accessKeyIs = function (accessKey) {
  return this.accessKey === accessKey;
};