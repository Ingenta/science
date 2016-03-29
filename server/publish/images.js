Meteor.publish('images', function () {
    return Images.find();
});

Meteor.publish('oneArticleFigures', function (articleDoi) {
    if(!articleDoi)return this.ready();
    var a = Articles.findOne({doi: articleDoi});
    if (!a)return this.ready();
    var thisArticleImageIds = _.pluck(a.figures, "imageId");
    return FiguresStore.find({_id: {$in: thisArticleImageIds}}, {sort: {'uploadedAt': -1}});
});
