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
        });
        return _.sortBy(result, function (obj) {
            return -obj.score;
        });
    },
    searchLink: function(){
        var option = {
            query:this.word,
            setting:{from:'keyword'}
        };
        return SolrQuery.makeUrl(option);
    }
})
