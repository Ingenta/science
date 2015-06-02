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
	  return Publications.find(q);
	},
	count: function (id) {
	  return Publications.find({publisher:id}).count();
	}

});
Template.FilterList.events({
	'click .filterButton': function (event) {
		var f = $(event.target).data().pubid;
	  //console.log(f);
	  //debugger
	  Session.set('filterPublisher', f);
	},
	'click .numberButton': function (event) {
		var num = $(event.target).text();
	  Session.set('firstletter', num);
	  Session.set('filterPublisher', undefined);
	}
});
Template.FilterList.onRendered(function () {
	Session.set('filterPublisher', undefined);
	Session.set('firstletter', undefined);
});
