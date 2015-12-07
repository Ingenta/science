Template.JournalOverview.helpers({
    getJournalIdFromSession: function () {
        var journalId = Session.get('currentJournalId');
        return journalId ? journalId : "";
        //var a = Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
    }
});

Template.journalCoverSummary.helpers({
    issnFormat: function (issn) {
        if (!issn) return;
        if (issn.length !== 8) return issn;
        return issn.substr(0, 4) + "-" + issn.substr(4, 4);
    }
});

Template.journalSummary.helpers({
    Title: function (id) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var publishers = Publishers.findOne({_id: id});
        var title = iscn ? publishers.chinesename : publishers.name;
        return title;
    },
    Frequency: function (num) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        if (num == "1") {
            var title = iscn ? "季刊" : "Quarterly Publication";
            return title;
        }
        if (num == "2") {
            var title = iscn ? "月刊" : "Monthly Publication";
            return title;
        }
        if (num == "3") {
            var title = iscn ? "半月刊" : "Bi-monthly Publication";
            return title;
        }
        if (num == "4") {
            var title = iscn ? "旬刊" : "Ten-day Publication";
            return title;
        }
    },
    articleLanguage: function (num2) {
        if (num2 == "1") {
            return TAPi18n.__("English");
        }
        if (num2 == "2") {
            return TAPi18n.__("Chinese");
        }
    }
});

Template.TagList.helpers({
    getTag: function () {
        return Tags.findOne({_id: this.toString()});
    }
});

Template.editorRecommendedArticles.helpers({
    editorRecommendedArticle: function () {
        var journalId = Session.get('currentJournalId');
        return EditorsRecommend.find({publications: journalId},{sort: {createDate: -1}, limit: 5});
    },
    titles: function (articleId) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var article = Articles.findOne({_id: articleId});
        if(!article)return;
        var title = iscn ? article.title.cn : article.title.en;
        return title;
    },
    hasMoreThanFiveRecommendedArticles: function () {
        var journalId = Session.get('currentJournalId');
        if (journalId)return EditorsRecommend.find({publications: journalId}).count() > 5;
    }
});

Template.editorRecommendedArticles.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            EditorsRecommend.remove({_id: id});
        })
    }
});

AutoForm.addHooks(['addRecommendModalForm'], {
    onSuccess: function () {
        $("#addRecommendModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    },
    before: {
        insert: function (doc) {
            doc.publications = Session.get('currentJournalId');
            doc.createDate = new Date();
            return doc;
        }
    }
}, true);

Template.addRecommendModalForm.helpers({
    s2OptWithFilter:function(){
        return SolrQuery.select2Options({"journalId":Session.get("currentJournalId")})
    }
});