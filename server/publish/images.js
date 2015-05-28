
Meteor.startup(function() {

	this.Images = new FS.Collection("images", {
		stores: [new FS.Store.FileSystem("images", {path: "C:/uploads"})]
	});
	Images.allow({
		insert: function (userId, doc) {
			return true;
		},  
		download: function (userId) {
			return true;
		}
	});
	Meteor.publish('images', function() {
		return images.find({}, {sort: ['name']});
	});

	Meteor.subscribe("images");

});
