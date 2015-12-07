Template.saSelectorForColl.events({
	'click button':function(e,t){
		e.preventDefault();
		var newOne = t.$("#saSelectorForCollection").select2('val');
		var newest          = _.compact(_.union(newOne, this.collInfo.articles));
		ArticleCollections.update({_id: Router.current().params.collId}, {$set: {articles: newest}});
		Meteor.subscribe("oneArticleMeta",newOne)
	}
})

Template.saSelectorForColl.helpers({
	s2opt:function(){
		var filter = {};
		if(this.collInfo.journalId)
			filter.journalId = this.collInfo.journalId;
		if(this.collInfo.publisherId)
			filter.publisher = this.collInfo.publisherId;
		return SolrQuery.select2Options(filter)
	}
})