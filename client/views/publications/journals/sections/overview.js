Template.JournalOverview.helpers({
    getJournalIdFromSession: function () {
        var journalId = Session.get('currentJournalId');
        return journalId ? journalId : "";
        //var a = Articles.find({journalId: journalId}, {sort: {createdAt: -1}, limit: 3});
    }
});

Template.journalSummary.helpers({
    Title: function (id) {
        var iscn = TAPi18n.getLanguage() === 'zh-CN';
        var publishers = Publishers.findOne({_id: id});
        if(publishers){
            return iscn ? publishers.chinesename : publishers.name;
        }
    },
    Frequency: function (num) {
        var frequency = ["", "Quarterly Publication", "Monthly Publication", "Semimonthly Publication", "Ten-day Publication", "Weekly Publication", "Bi-monthly Publication"];
        if (num) {
            return TAPi18n.__(frequency[num]);
        }
    },
    articleLanguage: function (num) {
        var language = ["", "English", "Chinese"];
        if (num) {
            return TAPi18n.__(language[num]);
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
        if(article){
            var title = iscn ? article.title.cn : article.title.en;
            return title;
        }
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
        Meteor.subscribe("recommendedJournalArticles",Session.get('currentJournalId'));
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

Template.issueCoverSummary.helpers({
    getCoverUrl:function(){
        var pictureId=this.defaultCover;

        var issueId=Session.get("currentIssueId");
        if(issueId){
            var issue = Issues.findOne({_id:issueId});
            if(issue && issue.picture)
                pictureId=issue.picture;
        }

        var noPicture = "http://sbiapps.sitesell.com/sitebuilder/sitedesigner/resource/basic_white_nce/image-files/thumbnail1.jpg";
        var imgObj = Images && pictureId && Images.findOne({_id: pictureId});
        return (imgObj && imgObj.url({auth:false})) || noPicture;
    }
})