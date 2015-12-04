Meteor.publish('editorRecommends', function (journalId) {
	if(journalId) {
		var recommended = EditorsRecommend.find({publications: journalId}, {fields: {ArticlesId: 1}}).fetch();
		var articleIds = _.pluck(recommended, "ArticlesId");
		return [
			Articles.find({_id: {$in: articleIds}}, {
				fields: articleWithMetadata
			}),
			EditorsRecommend.find({publications: journalId})
		];
	}
	else{
		this.ready();
	}
});
