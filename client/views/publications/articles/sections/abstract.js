Template.AbstractTemplate.events({
	'mouseup .interesting-content':function(e){
		SolrQuery.interstingSearch(e);
	}
});

Template.AbstractTemplate.helpers({
	getJournalIdFromSession: function () {
		var journalId = Session.get('currentJournalId');
		return journalId ? journalId : "";
	}
});


Template.fundingTemplating.helpers({
	"fundings3":function(){
		return _.first(this.fundings,3);
	}
})