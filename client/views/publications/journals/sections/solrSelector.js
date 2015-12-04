Template.saSelectorForST.events({
	'click button':function(e,t){
		e.preventDefault();
		var newOne = t.$("#saSelectorForSTopic").select2('val');
		var newest          = _.union(newOne, this.articles);
		SpecialTopics.update({_id: this._id}, {$set: {articles: newest}});
		Meteor.subscribe("oneArticleMeta",newOne)
	}
})

Template.saSelectorForST.helpers({
	s2opt:function(){
		var filter = {};
		if(this.IssueId){
			var issObj = Issues.findOne({_id:this.IssueId})
			if(issObj && issObj.issue){
				filter.issue = issObj.issue;
				filter.volume = issObj.volume;
				filter.journalId = issObj.journalId;
			}
		}
		return SolrQuery.select2Options(filter)
	}
})