Template.mostReadArticle.events({
    'click .datesort': function (event) {
        Session.set("sort",event.target.value);
    }
});

Template.mostReadArticle.helpers({
    mostReadArticles: function () {
        Meteor.call("getMostRead", Meteor.userId(), function (err, result) {
            Session.set("mostRead", result);
        });
        // ArticleViews获取最多引用
        var most = Session.get("mostRead");
        if (!most)return;
        // 获取更多Id
        var allId=[];
        _.each(most,function(item){
            allId.push(item._id.articleId);
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
