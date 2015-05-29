Template.FilterList.helpers({
		publishers: function () {
		  return Publishers.find();
		}, 
		publications: function () {
		  return Publications.find();
		},
		count: function (url) {
		  return Publications.find({publisher:url}).count();
		}
});

