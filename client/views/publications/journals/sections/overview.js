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
            var title = iscn ? "半月刊" : "Semimonthly Publication";
            return title;
        }
        if (num == "4") {
            var title = iscn ? "旬刊" : "The ten-day Publication";
            return title;
        }
    },
    Language: function (num2) {
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

Template.recommendArticles.helpers({
    recommendArticles: function () {
        var journalId = Session.get('currentJournalId');
        return Recommend.find({publications: journalId},{sort: {createDate: -1}, limit: 5});
    },
    titles: function (Aid) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var article = Articles.findOne({_id: Aid});
        var title = iscn ? article.title.cn : article.title.en;
        return title;
    },
    ArticleUrl: function (Arid) {
        var journalId = Session.get('currentJournalId');
        var title = Publications.findOne({_id: journalId}).shortTitle;
        var article = Articles.findOne({_id: Arid});
        if (article)
            return title + "/" + article.volume + "/" + article.issue + "/" + article.doi;
    },
    hasMoreThanFiveRecommendedArticles: function () {
        var journalId = Session.get('currentJournalId');
        if (journalId)return Recommend.find({publications: journalId}).count() > 5;
    }
});

Template.recommendArticles.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e, function () {
            Recommend.remove({_id: id});
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
    getArticles: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var journalId = Session.get('currentJournalId');
        var jouRec = Recommend.find({publications: journalId}).fetch();
        var jouId = _.pluck(jouRec,"ArticlesId");
        var articles = Articles.find({journalId: journalId,_id:{$nin:jouId}}).fetch();
        var result = [];
        _.each(articles, function (item) {
            var name = iscn ? item.title.cn : item.title.en;
            result.push({label: name, value: item._id});
        });
        return result;
    }
});

Template.updateRecommendModalForm.helpers({
    getArticles: function () {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var journalId = Session.get('currentJournalId');
        var jouRec = Recommend.find({publications: journalId,_id:{$ne:this._id}}).fetch();
        var jouId = _.pluck(jouRec,"ArticlesId");
        var articles = Articles.find({journalId: journalId,_id:{$nin:jouId}}).fetch();
        var result = [];
        _.each(articles, function (item) {
            var name = iscn ? item.title.cn : item.title.en;
            result.push({label: name, value: item._id});
        });
        return result;
    }
});