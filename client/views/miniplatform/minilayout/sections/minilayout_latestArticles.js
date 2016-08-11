Template.layoutLatestArticles.helpers({
    recommendArticles: function () {
        return NewsRecommend.find({},{sort: {createDate: -1}, limit: 7});
    },
    //lastArticle: function () {
    //    var publisher = Publishers.findOne({shortname : Config.defaultPublisherShortName});
    //    var list = NewsRecommend.find({},{sort: {createDate: -1}});
    //    if(list.count()<6){
    //        return Articles.find({publisher: publisher._id}, {sort: {createdAt: -1}, limit: (6-list.count())});
    //    }else{
    //        return;
    //    }
    //},
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
        if(article && article.published){
            if(_.isString(article.published))return article.published;
            return article.published && article.published.format("yyyy-MM-dd");
        }
    },
    articlesUrl: function(id){
        var article = Articles.findOne({_id: id}, {fields: {doi: 1}});
        if (article) {
            return  "http://engine.scichina.com/doi/" + article.doi;
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
    s2Opts :function(){
        return SolrQuery.select2Options();
    }
});

Template.updateLatestArticlesModalForm.helpers({
    getArticles: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var publisher = Publishers.findOne({shortname : Config.defaultPublisherShortName});
        if(publisher){
            var rec = NewsRecommend.find({_id:{$ne:this._id}}).fetch();
            var recId = _.pluck(rec,"ArticlesId");
            var articles = Articles.find({publisher:publisher._id,_id:{$nin:recId}}).fetch();
            var result = [];
            _.each(articles, function (item) {
                var name = iscn ? item.title.cn : item.title.en;
                result.push({label: name, value: item._id});
            });
            return result;
        }
    }
});

AutoForm.addHooks(['addLatestArticlesModalForm'], {
    onSuccess: function () {
        $("#addLatestArticlesModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
        Meteor.subscribe("recommendedMiniPlatformArticles");
    },
    before: {
        insert: function (doc) {
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);
