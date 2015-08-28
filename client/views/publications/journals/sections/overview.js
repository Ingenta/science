Template.latestUploadedArticles.helpers({
    latestArticles: function () {
        var journalId = Session.get('currentJournalId');
        if (!journalId)return;
        var a = Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
        if (!a)return;
        return a;
    }
});

Template.recentlyViewedArticles.helpers({
    recentArticles: function () {
        var articleIdList = Session.get("recentViewedArticles");
        if (!articleIdList)return;
        var recentViewedArticles = [];
        articleIdList.forEach(function (oneId) {
            var oneArticle = Articles.findOne(oneId);
            if (oneArticle) recentViewedArticles.push(oneArticle);
        });
        return recentViewedArticles;
    }
});

Template.journalCoverSummary.helpers({
   issnFormat: function (issn) {
       if(!issn) return;
       if(issn.length !== 8) return issn;
       return issn.substr(0,4) + "-" + issn.substr(4,4);
   }
});

Template.journalSummary.helpers({
    Title: function (id) {
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        var publishers = Publishers.findOne({_id:id});
        var title = iscn?publishers.chinesename:publishers.name;
        return title;
    },
    Frequency: function (num) {
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        if(num=="1"){
            var title = iscn?"季刊":"Quarterly Publication";
            return title;
        }
        if(num=="2"){
            var title = iscn?"月刊":"Monthly Publication";
            return title;
        }
        if(num=="3"){
            var title = iscn?"半月刊":"Semimonthly Publication";
            return title;
        }
        if(num=="4"){
            var title = iscn?"旬刊":"The ten-day Publication";
            return title;
        }
    },
    Types: function (num1) {
        if(num1=="1"){
            return "EES";
        }
        if(num1=="2"){
            return "DOAJ";
        }
    },
    Language: function (num2) {
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        if(num2=="1"){
            var title = iscn?"英文":"English";
            return title;
        }
        if(num2=="2"){
            var title = iscn?"中文":"Chinese";
            return title;
        }
    }
});

Template.recommendArticles.helpers({
    recommendArticles: function () {
        var journalId = Session.get('currentJournalId');
        return Recommend.find({publications:journalId});
    },
    titles: function (Aid) {
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        var article = Articles.findOne({_id:Aid});
        var title = iscn?article.title.cn:article.title.en;
        return title;
    },
    ArticleUrl: function (Arid) {
        var journalId = Session.get('currentJournalId');
        var title = Publications.findOne({_id:journalId}).title;
        var article = Articles.findOne({_id:Arid});
        var urls = title+"/"+article.volume+"/"+article.issue+"/"+article.doi;
        return urls;
    }
});

AutoForm.addHooks(['addRecommendModalForm'], {
    onSuccess: function () {
        $("#addRecommendModal").modal('hide');
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            doc.publications = Session.get('currentJournalId');
            return doc;
        }
    }
}, true);

Template.addRecommendModalForm.helpers({
    getArticles:function(){
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = Articles.find({journalId:journalId}).fetch();
        var result = [];
        _.each(articles,function(item){
            var name = iscn?item.title.cn:item.title.en;
            result.push({label:name,value:item._id});
        });
        return result;
    }
});

Template.updateRecommendModalForm.helpers({
    getArticles:function(){
        var iscn=TAPi18n.getLanguage()==='zh-CN';
        var journalId = Session.get('currentJournalId');
        var articles = Articles.find({journalId:journalId}).fetch();
        var result = [];
        _.each(articles,function(item){
            var name = iscn?item.title.cn:item.title.en;
            result.push({label:name,value:item._id});
        });
        return result;
    }
});