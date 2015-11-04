Template.AbstractTemplate.events({
	'mouseup .interesting-content':function(e){
		SolrQuery.interstingSearch(e);
	}
});

Template.AbstractTemplate.helpers({
	getJournalIdFromSession: function () {
		var journalId = Session.get('currentJournalId');
		return journalId ? journalId : "";
	},
	getAbstract:function(){
		if(_.isString(this.abstract))
			return this.abstract;
		else if(_.isObject(this.abstract)){
			return Science.JSON.try2GetRightLangVal(this.abstract);
		}
	}
});


Template.fundingTemplating.helpers({
	"fundings3":function(){
		return _.first(this.fundings,3);
	}
})