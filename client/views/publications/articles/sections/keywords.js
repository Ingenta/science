Template.keywordsPanel.helpers({
    getKeywords: function () {
        var result = [];
        var total = 0;
        _.each(this.keywords, function (item) {
            var keyword = {};
            keyword.word = item;
            keyword.score = Keywords.findOne({name: item}).score;
            total += keyword.score;
            result.push(keyword);
        });
        _.each(result, function (item) {
            item.percent = item.score / total * 100;
        });
        return _.sortBy(result, function (obj) {
            return -obj.score;
        });
    }
})
