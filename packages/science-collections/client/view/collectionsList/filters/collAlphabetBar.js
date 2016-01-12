Template.collAlphabetBar.helpers({
	letterInTheAlphabet: function () {
		return "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z".split(',');
	},
	select: function(){
		var num = Session.get('firstLetter');
		if(num==this)
			return "select-filter";
	}
});

Template.collAlphabetBar.events({
	'click .letterFilter': function (event) {
		var num = $(event.target).text();
		Session.set('firstLetter', num);
		Session.set('filterPublisher', undefined);
		Session.set('PerPage', 10);
	},
	'click .resetAlphabetFilter': function () {
		Session.set('firstLetter', undefined);
		Session.set('PerPage', 10);
	},
    'click .resetOtherFilter': function () {
        Session.set('firstLetter',"other");
        Session.set('filterPublisher', undefined);
        Session.set('PerPage', 10);
    }
});