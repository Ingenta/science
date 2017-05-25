Meteor.publish('images', function () {
    // return Images.find({},{fields:{uploadedAt:0,original:0,owner:0,"copies.images.createdAt":0,"copies.images.updatedAt":0,"copies.images.key":0}});
    return Images.find({},{fields:{"copies.images.key":1}});
});

Meteor.publish('oneArticleFigures', function (articleDoi) {
    if(!articleDoi)return this.ready();
    var a = Articles.findOne({doi: articleDoi});
    if (!a)return this.ready();
    var thisArticleImageIds = _.union(_.pluck(a.figures, "imageId"),_.pluck(a.authorFigures, "imageId"));
    return FiguresStore.find({_id: {$in: thisArticleImageIds}}, {sort: {'uploadedAt': -1}});
});
