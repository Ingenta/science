Template.PublicationsList.helpers({
    publications: function () {
      return Publications.find();
  }
});

Template.SimplePublisherList.helpers({
    publishers: function () {
      return Publishers.find();
    },
	count: function (url) {
      return Publications.find({publisher:url}).count();

    }
});

