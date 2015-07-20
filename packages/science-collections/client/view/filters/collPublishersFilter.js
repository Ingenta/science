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
	'click .clearPublisher': function (event) {
		Session.set('filterPublisher', undefined);
		Session.set('PerPage', 10);
	}
});

Template.onePublisherInCollFilterList.events({
	'click .filterButton': function (event) {
		Session.set('filterPublisher', this._id);
		Session.set('PerPage', 10);
	}
});

Template.onePublisherInCollFilterList.helpers({
	count: function () {
		var first = Session.get('firstLetter');
		if (first === undefined)
			return ArticleCollections.find({publisherId: this._id}).count();
		return ArticleCollections.find({publisherId: this._id, title: {$regex: "^" + first, $options: "i"}}).count();
	}
});

Template.onePublisherInCollFilterListGray.helpers({
	count: function () {
		var first = Session.get('firstLetter');
		if (first === undefined)
			return ArticleCollections.find({publisherId: this._id}).count();
		return ArticleCollections.find({publisherId: this._id, title: {$regex: "^" + first, $options: "i"}}).count();
	}
});