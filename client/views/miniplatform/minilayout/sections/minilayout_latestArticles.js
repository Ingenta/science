Template.layoutLatestArticles.helpers({
    recommendArticles: function () {
        return NewsRecommend.find({}, {limit: 6});
    },
    titles: function (Aid) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var article = Articles.findOne({_id: Aid});
        var title = iscn ? article.title.cn : article.title.en;
        return title;
    },
    publishDate: function (Apid) {
        var article = Articles.findOne({_id: Apid});
        var Date = article.published;
        return Date;
    },
    ArticleUrl: function (Arid) {
        var publisher = Publishers.findOne({_id:Config.mainPublish});
        var article = Articles.findOne({_id: Arid});
        var publication = Publications.findOne({_id: article.journalId});
        if (article)return "/publisher/" +publisher.name+ "/journal/" + publication.title + "/" + article.volume + "/" + article.issue + "/" + article.doi;
    }
});

Template.layoutLatestArticles.events({
    'click #pubDel': function (e) {
        var pid = this._id;
        confirmDelete(e,function(){
            NewsCenter.remove({_id:pid});
        })
    }
})

//AutoForm.addHooks(['addNewsRecommendModalForm'], {
//    'click #latestADel': function (e) {
//        var id = this._id;
//        confirmDelete(e, function () {
//            NewsRecommend.remove({_id: id});
//        })
//    }
//});

Template.addLatestArticlesModalForm.helpers({
    getArticles: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var articles = Articles.find({publisher:Config.mainPublish}).fetch();
        var result = [];
        _.each(articles, function (item) {
            var name = iscn ? item.title.cn : item.title.en;
            result.push({label: name, value: item._id});
        });
        return result;
    }
});

Template.updateLatestArticlesModalForm.helpers({
    getArticles: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var articles = Articles.find({publisher:Config.mainPublish}).fetch();
        var result = [];
        _.each(articles, function (item) {
            var name = iscn ? item.title.cn : item.title.en;
            result.push({label: name, value: item._id});
        });
        return result;
    }
});

AutoForm.addHooks(['addLatestArticlesModalForm'], {
    onSuccess: function () {
        $("#addLatestArticlesModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);
