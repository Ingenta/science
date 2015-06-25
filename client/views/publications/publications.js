Template.onePublication.helpers({
	getUrlToJournal: function (id, title) {
		var name =Publishers.findOne({_id:id}).name
		return "/publisher/"+name+"/journal/"+title;
	}
});
Template.onePublisherInFilterList.helpers({
	count: function (id) {
		var first = Session.get('firstLetter');
		if(first===undefined)
			return Publications.find({publisher:id}).count();
		return Publications.find({publisher:id,shortTitle:{ $regex : "^"+first, $options:"i" }}).count();
	}
});
Template.PublicationsAlphabetBar.helpers({
	totalPublicationResults: function () {
		return Session.get('totalPublicationResults');

	},
	totalPluralPublicationResults: function () {
		var total= Session.get('totalPublicationResults');
		return pluralize(total, 'result');
	},
	letterInTheAlphabet: function () {
		return "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
	}
});
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
		var first = Session.get('firstLetter');
		var q={};
		pubId && (q.publisher=pubId);
		first && (q.shortTitle={ $regex : "^"+first, $options:"i" });
		Session.set("totalPublicationResults", Publications.find(q).count());
		var pubs=myPubPagination.find(q, {itemsPerPage:10});
		return pubs;
	},
	selectedPublisher: function(){
		return Session.get('filterPublisher');
	}

});

Template.FilterList.events({
	'click .filterButton': function (event) {
		var f = $(event.target).data().pubid;
		Session.set('filterPublisher', f);
	},
	'click .letterFilter': function (event) {
		var num = $(event.target).text();
		Session.set('firstLetter', num);
		Session.set('filterPublisher', undefined);
	},
	'click .clearPublisher': function (event) {
		Session.set('filterPublisher', undefined);
	},
	'click .resetAlphabetFilter': function(event){
		Session.set('firstLetter', undefined);
	}
});
Template.FilterList.onRendered(function () {
	Session.set('filterPublisher', undefined);
	Session.set('firstLetter', undefined);
});
