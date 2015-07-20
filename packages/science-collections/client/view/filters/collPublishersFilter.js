Template.collPublishersFilter.helpers({
	publishers: function () {
		var pubId = Session.get('filterPublisher');
		if (pubId === undefined) {
			return Publishers.find();
		}
		return Publishers.find({_id: pubId});
	},
	selectedPublisher: function () {
		return Session.get('filterPublisher');
	}

});

Template.collPublishersFilter.events({
	'click .filterButton': function (event) {
		var f = $(event.target).data().pubid;
		Session.set('filterPublisher', f);
		Session.set('PerPage', 10);
	},
	'click .clearPublisher': function (event) {
		Session.set('filterPublisher', undefined);
		Session.set('PerPage', 10);
	}
});