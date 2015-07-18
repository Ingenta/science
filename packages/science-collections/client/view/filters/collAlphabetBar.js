Template.collAlphabetBar.helpers({
	letterInTheAlphabet: function () {
		return "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
	}
});

Template.collAlphabetBar.events({
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