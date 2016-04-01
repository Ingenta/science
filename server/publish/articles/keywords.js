
Meteor.publish('oneArticleKeywords', function (articleDoi) {
    if(!articleDoi)return this.ready();
    check(articleDoi, String);
    var a = Articles.findOne({doi: articleDoi},{fields:{keywords:1}});
    if (!a)return this.ready();
    var all = _.union(a.keywords.en, a.keywords.cn);
    return Keywords.find({name: {$in: all}});
})