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
		if(!this.abstract || (!this.abstract.en && !this.abstract.cn))
			return TAPi18n.__("noAbstract");
		if(_.isString(this.abstract))
			return this.abstract;
		else if(_.isObject(this.abstract)){
			return Science.JSON.try2GetRightLangVal(this.abstract);
		}
	}
});


Template.fundingInfo.helpers({
	"fundingsGroup":function(){
		if(_.isArray(this.fundings)){
			var aftReduce = _.reduce(this.fundings,function(result, item){
				if(result[item.source])
					result[item.source].code+=", "+ item.contract;
				else if(item.contract){
					result[item.source]={
						name:item.source,
						code:item.contract
					}
				}
				console.log(result);
				return result;
			},{});
			return _.first(_.values(aftReduce), 3);
		}else if(_.isString(this.fundings)){
			return [{name:this.fundings}];
		}
	}
})