Meteor.publish('images', function () {
    return Images.find();
});
Meteor.publish('articleXml', function () {
    return ArticleXml.find({}, {sort: {'uploadedAt': -1}});
});
Meteor.publish('oneArticleFigures', function (articleDoi) {
    var a = Articles.findOne({doi: articleDoi});
    if (!a)return;
    var thisArticleImageIds = [];
    var ids = _.pluck(a.figures, "imageId");
    if (ids)thisArticleImageIds = ids;
    return ArticleXml.find({_id: {$in: thisArticleImageIds}}, {sort: {'uploadedAt': -1}});
});
