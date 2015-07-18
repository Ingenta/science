Template.collectionsAlphabetBar.helpers({
	letterInTheAlphabet: function () {
		return "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
	}
});

Template.collectionsAlphabetBar.events({
	'click .letterFilter': function (event) {
		var num = $(event.target).text();
		Session.set('firstLetter', num);
		Session.set('filterPublisher', undefined);
		Session.set('PerPage', 10);
	},
	'click .resetAlphabetFilter': function (event) {
		Session.set('firstLetter', undefined);
		Session.set('PerPage', 10);
	}
});

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
	//'click .perPage': function (event) {
	//	var pageNum = $(event.target).data().pagenum;
	//	Session.set('PerPage', pageNum);
	//}
});