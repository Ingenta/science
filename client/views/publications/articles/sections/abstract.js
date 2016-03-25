Template.AbstractContentAndKeywords.events({
	'mouseup .interesting-content':function(e){
		SolrQuery.interstingSearch(e);
	}
});
Template.AbstractTemplate.helpers({
	getJournalIdFromSession: function () {
		var journalId = Session.get('currentJournalId');
		return journalId ? journalId : "";
	},
	isAccepted: function (){
		var pubStatus = Template.currentData().pubStatus;
		if(pubStatus=='accepted')return true;
	}
});
Template.AbstractContentAndKeywords.helpers({
	getAbstract:function(){
		if(!this.abstract)return TAPi18n.__("There is no abstract available for this article.");
		if(_.isString(this.abstract))
			return this.abstract;
		else if(_.isObject(this.abstract)){
			return Science.JSON.try2GetRightLangVal(this.abstract);
		}
	}
});


Template.fundingInfo.helpers({
	"fundings3":function(){
		return _.first(this.fundings,3);
	}
})