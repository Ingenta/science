Template.layoutLatestArticles.helpers({
    recommendArticles: function () {
        return NewsRecommend.find({}, {limit: 6});
    },
    hide: function () {
        return NewsRecommend.find().count()<6 ? "": "hide";
    },
    titles: function (Aid) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var article = Articles.findOne({_id: Aid});
        if(article){
            var title = iscn ? article.title.cn : article.title.en;
            return title;
        }
    },
    publishDate: function (Apid) {
        var article = Articles.findOne({_id: Apid});
        if(article)return article.published.format("yyyy-MM-dd");
    },
    ArticleUrl: function (Arid) {
        var article = Articles.findOne({_id: Arid});
        if (article){
            var publication = Publications.findOne({_id: article.journalId});
            if(publication){
                var publisher = Publishers.findOne({_id:publication.publisher});
                return "/publisher/" +publisher.name+ "/journal/" + publication.title + "/" + article.volume + "/" + article.issue + "/" + article.doi;
            }
        }
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
