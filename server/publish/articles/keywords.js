Meteor.publish('keywords', function () {
    return Keywords.find();
});
Meteor.publish('oneArticleKeywords', function (articleDoi) {
    var a = Articles.findOne({doi: articleDoi});
    if (!a)return;
    var all = _.union(a.keywords.en, a.keywords.cn);
    return Keywords.find({name: {$in: all}});
})