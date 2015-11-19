Science.URL = {};

Science.URL.journalDetail = function (journalId) {
    var journal = Publications.findOne({_id: journalId}, {fields: {publisher: 1, shortTitle: 1}});
    if (journal) {
        var pub = Publishers.findOne({_id: journal.publisher}, {fields: {name: 1}});
        if (!pub)return;
        var journalPart = "/publisher/" + pub.name + "/journal/" + journal.shortTitle;
        return journalPart;
    }
};

Science.URL.issueDetail = function (issueId) {
    var issue = Issues.findOne({_id: issueId});
    if (issue) {
        var journal = Publications.findOne({_id: issue.journalId}, {fields: {publisher: 1, shortTitle: 1}});
        if (!journal)return;
        var pub = Publishers.findOne({_id: journal.publisher}, {fields: {name: 1}});
        if (!pub)return;
        var journalPart = "/publisher/" + pub.name + "/journal/" + journal.shortTitle;
        var issuePart = "/" + issue.volume + "/" + issue.issue;
        return journalPart + issuePart;
    }
};

Science.URL.articleDetail = function (articleId) {
    var article = Articles.findOne({_id: articleId}, {fields: {publisher: 1, journalId: 1, issueId: 1, doi: 1}});
    if (article) {
        var pub = Publishers.findOne({_id: article.publisher}, {fields: {name: 1}});
        if (!pub)return;
        var journal = Publications.findOne({_id: article.journalId}, {fields: {publisher: 1, shortTitle: 1}});
        if (!journal)return;
        var issue = Issues.findOne({_id: article.issueId});
        if (!issue)return;
        var journalPart = "/publisher/" + pub.name + "/journal/" + journal.shortTitle;
        var issuePart = "/" + issue.volume + "/" + issue.issue;
        return journalPart + issuePart + "/" + article.doi;
    }
}