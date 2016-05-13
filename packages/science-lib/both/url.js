Science.URL = {};

Science.URL.journalDetail = function (journalId) {
    var journal = Publications.findOne({_id: journalId}, {fields: {publisher: 1, shortTitle: 1}});
    if (journal) {
        var pub = Publishers.findOne({_id: journal.publisher}, {fields: {shortname: 1}});
        if (!pub)return;
        var journalPart = "/publisher/" + pub.shortname + "/journal/" + journal.shortTitle;
        return journalPart;
    }
};

Science.URL.issueDetail = function (issueId) {
    var issue = Issues.findOne({_id: issueId});
    if (issue) {
        var journal = Publications.findOne({_id: issue.journalId}, {fields: {publisher: 1, shortTitle: 1}});
        if (!journal)return;
        var pub = Publishers.findOne({_id: journal.publisher}, {fields: {shortname: 1}});
        if (!pub)return;
        var journalPart = "/publisher/" + pub.shortname + "/journal/" + journal.shortTitle;
        return journalPart + "#" + issueId;
    }
};

Science.URL.articleDetail = function (articleId) {
    var article = Articles.findOne({_id: articleId}, {fields: {doi: 1}});
    if (article) {
        return  "/doi/" + article.doi;
    }
}