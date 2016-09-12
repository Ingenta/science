Meteor.publish('editorRecommends', function (journalId) {
	if(!journalId)return this.ready();
	check(journalId, String);
	var recommended = EditorsRecommend.find({publications: journalId}, {fields: {ArticlesId: 1}},{sort: {createDate:-1}, limit: 20}).fetch();
	var articleIds = _.pluck(recommended, "ArticlesId");
	return [
		Articles.find({_id: {$in: articleIds}}, {
			fields: articleWithMetadata
		}),
		EditorsRecommend.find({publications: journalId})
	];
});
Meteor.startup(function () {
	EditorsRecommend._ensureIndex({publications: 1});
});
