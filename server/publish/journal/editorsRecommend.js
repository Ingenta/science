Meteor.publish('recommend', function (publicationsId) {

	var recommended = EditorsRecommend.find({publications: publicationsId}, {fields: {ArticlesId: 1}}).fetch();
	var articleIds  = _.pluck(recommended, "ArticlesId");
	return [
		Articles.find({_id: {$in: articleIds}}, {
			fields: minimumArticle
		}),
		EditorsRecommend.find({publications: publicationsId})
	];
});
