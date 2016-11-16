Template.keywordsPanel.helpers({
    getKeywords: function () {
        var result = [];
        var total = 0;
        var lang = ["cn","en"]
        var index = TAPi18n.getLanguage()=='zh-CN'?0:1;
        if(_.isEmpty(this.keywords))return;
        //若没有当前语种的关键词，则使用另一种语种关键词
        var kwds= this.keywords[lang[index]] || this.keywords[lang[1-index]];
        _.each(kwds, function (item) {
            if (Keywords.findOne({name: item})) {
                var keyword = {};
                keyword.word = item;
                keyword.score = Keywords.findOne({name: item}).score;
                total += keyword.score;
                result.push(keyword);
            }
        });
        _.each(result, function (item) {
            item.percent = item.score / total * 100;
            //科学社要求和AIP相同展示Content Score is **，所以增加一个字段
            item.proportion = parseInt(item.score / total * 100);
        });
        //科学社要求搜索最高的改成黄条满格，所以最高的赋值为100
        var max = _.max(result, function(result){return result.percent;});
        max.percent = 100;

        return _.sortBy(result, function (obj) {
            return -obj.score;
        });
    },
    searchLink: function(){
        var option = {
            query:Science.String.forceClear(this.word),
            setting:{from:'keyword'}
        };
        return SolrQuery.makeUrl(option);
    }
});
Template.keywordsPanel.events({
    'click a': function(){
        var article = Router.current().data && Router.current().data();
        if (!article)return;
        var keywords = this.word;
        Meteor.call('updateKeywordScore',keywords,5,function(err,result){});
        Meteor.call("insertAudit", Meteor.userId(), "keyword", article.publisher, article.journalId, article._id, keywords, function (err, response) {
            if (err) console.log(err);
        });
    }
})
