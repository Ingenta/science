Template.FilterList.helpers({
	publishers: function () {
		var pubId = Session.get('filterPublisher');
		if(pubId===undefined){
			return Publishers.find();
		}
		return Publishers.find({_id:pubId});
	},
	publications: function () {
		var pubId = Session.get('filterPublisher');
		var firstletter = Session.get('firstletter');
		var q={};
		pubId && (q.publisher=pubId);
		firstletter && (q.firstletter=firstletter);
		Session.set("totalPublicationResults", Publications.find(q).count());
		return Publications.find(q);
	},
	totalPublicationResults: function () {
		return Session.get('totalPublicationResults');

	},
	totalPluralPublicationResults: function () {
		var total= Session.get('totalPublicationResults');
		return pluralize(total, 'result');
	},
	count: function (id) {
		var first = Session.get('firstletter');
		if(first===undefined)
			return Publications.find({publisher:id}).count();
		return Publications.find({publisher:id,firstletter:first}).count();
	},
	selectedPublisher: function(){
		return Session.get('filterPublisher');
	},
	getPublisherNameById: function (id) {
		return Publishers.findOne({_id:id}).name;
	},
	letterInTheAlphabet: function () {
		return "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
	},
	getUrlToJournal: function (id, title) {
		var name =Publishers.findOne({_id:id}).name
		return "/publisher/"+name+"/journal/"+title;
	}

});

Template.FilterList.events({
	'click .filterButton': function (event) {
		var f = $(event.target).data().pubid;
		Session.set('filterPublisher', f);
	},
	'click .numberButton': function (event) {
		var num = $(event.target).text();
		Session.set('firstletter', num);
		Session.set('filterPublisher', undefined);
	},
	'click .clearPublisher': function (event) {
		Session.set('filterPublisher', undefined);
	},
});
Template.FilterList.onRendered(function () {
	Session.set('filterPublisher', undefined);
	Session.set('firstletter', undefined);
});