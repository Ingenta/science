Template.PublicationsList.helpers({
    publications: function () {
      return Publications.find();
  }
});

Template.SimplePublisherList.helpers({
    publishers: function () {
		//console.log(this);
      return Publishers.find();
    },
	count: function (url) {
		console.log(url);
      return Publications.find({publisher:url}).count();

    }
});

