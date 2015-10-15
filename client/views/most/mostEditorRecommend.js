Template.mostRecommendArticles.helpers({
    mostRecommendArticles: function () {
        var journalId = Session.get('currentJournalId');
        var editorRecommends = Recommend.find({publications:journalId}).fetch();
        var result = [];
        _.each(editorRecommends,function(item){
            var article = Articles.findOne({_id: item.ArticlesId});
            result.push(article);
        });
        return result;
    },
    journalName: function (id) {
        return Publications.findOne({_id: id}).title;
    },
    getFullName: function () {
        if (TAPi18n.getLanguage() === "zh-CN")
            return this.surname.cn + ' ' + this.given.cn;
        return this.surname.en + ' ' + this.given.en;
    },
    query      : function () {
        return Router.current().params.searchQuery;
    }
});