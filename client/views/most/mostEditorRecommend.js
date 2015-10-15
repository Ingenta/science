Template.mostReadArticle.helpers({
    mostRecommendArticles: function () {
        var journalId = Session.get('currentJournalId');
        if(0 < Recommend.find({publications:journalId})){
            return Articles.findOne({_id: Recommend.find({publications:journalId}).ArticlesId});
        }
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