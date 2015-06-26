Template.articleListTree.helpers({
    volumeList: function (journalId) {
        if (journalId) {
            return Volumes.find({'journalId': journalId}, {sort: {'volume': -1}});
        } else {
            throw new Error("Lack of query conditions， 缺少查询条件!journalId:'+journalId+'");
        }
    },
    issueList: function (journalId, volume) {
        if (journalId && volume) {
            return Issues.find({'journalId': journalId, 'volume': volume}, {sort: {'issue': -1}});
        } else {
            throw new Error("Lack of query conditions， 缺少查询条件!journalId:'" + journalId + "',volume:'" + volume);
        }
    }
});

Template.articleListTree.events({
    "click .volume": function (event) {
        $(event.target).find("span").text($(event.target).next("div").is(':visible') ? '+' : '-');
        $(event.target).next("div").toggle(200);
    },
    "click .issue": function (event) {
        var issue = $(event.target).data().value;
        issue && Session.set("currIssue", issue);
    }
});


Template.articleListRight.helpers({
    articles: function () {
        if (Config.isDevMode) {
            var journalId = Session.get('currentJournalId');
            q = {journalId: journalId};
        } else {
            var curIssue = Session.get("currIssue");
            if (!curIssue) {
                var journalId = Session.get('currentJournalId');
                var lastIssue = Issues.findOne({'journalId': journalId}, {sort: {'volume': -1, 'issue': -1}});
                lastIssue && Session.set("currIssue", lastIssue._id) && (curIssue = lastIssue._id);
            }
            var q = curIssue ? {issueId: curIssue} : {};
        }
        return Articles.find(q, {sort: {title: 1}});
    }

});

