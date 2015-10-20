Template.mostRecommendArticles.events({
    'click .datesort': function (event) {
        Session.set("sort",event.target.value);
    }
});

Template.mostRecommendArticles.helpers({
    mostRecommendArticles: function () {
        var journalId = Session.get('currentJournalId');
        var editorRecommends = Recommend.find({publications:journalId}, {limit: 20}).fetch();
        // 获取更多Id
        var allId=[];
        _.each(editorRecommends,function(item){
            allId.push(item.ArticlesId);
        });
        // 返回article信息，并排序
        var sort = {};
        if(Session.get("sort"))
            sort={"published":Session.get("sort")};
        return Articles.find({_id:{$in:allId}},{sort:sort});
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