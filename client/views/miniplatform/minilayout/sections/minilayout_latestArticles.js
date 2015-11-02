Template.layoutLatestArticles.helpers({
    recommendArticles: function () {
        return NewsRecommend.find({}, {limit: 6});
    },
    titles: function (Aid) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var article = Articles.findOne({_id: Aid});
        if(article){
            var title = iscn ? article.title.cn : article.title.en;
            return title;
        }
        return;
    },
    publishDate: function (Apid) {
        var article = Articles.findOne({_id: Apid});
        if(article)return article.published.format("yyyy-MM-dd");
        return;
    },
    ArticleUrl: function (Arid) {
        var article = Articles.findOne({_id: Arid});
        if (article){
            var publisher = Publishers.findOne({_id:article.publisher});
            var publication = Publications.findOne({_id: article.journalId});
            return "/publisher/" +publisher.name+ "/journal/" + publication.title + "/" + article.volume + "/" + article.issue + "/" + article.doi;
        }
        return;
    }
});

Template.layoutLatestArticles.events({
    'click #latestADel': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            NewsRecommend.remove({_id: id});
        })
    }
});

Template.addLatestArticlesModalForm.helpers({
    getArticles: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var publisher = Publishers.findOne({agree:true});
        if(publisher){
            var articles = Articles.find({publisher:publisher._id}).fetch();
            var result = [];
            _.each(articles, function (item) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            });
            return result;
        }
        return;
    }
});

Template.updateLatestArticlesModalForm.helpers({
    getArticles: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var publisher = Publishers.findOne({agree:true});
        if(publisher){
            var articles = Articles.find({publisher:publisher._id}).fetch();
            var result = [];
            _.each(articles, function (item) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            });
            return result;
        }
        return;
    }
});

AutoForm.addHooks(['addLatestArticlesModalForm'], {
    onSuccess: function () {
        $("#addLatestArticlesModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);
