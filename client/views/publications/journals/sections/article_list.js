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
        var nextValue = $(event.target).next("div").is(':visible') ? '+' : '-';
        $(event.target).find("span").text(nextValue);
        $(event.target).next("div").toggle(200);
    },
    "click .issue": function (event) {
        var issue = $(event.target).data().value;
        issue && Session.set("currIssue", issue);
    }
});


Template.articleListRight.helpers({
    resetArticlesFilter: function () {
        //Only reset session if volume and issue aren't set
        if (!Router.current().params.volume)
            if (!Router.current().params.issue)
                Session.set("currIssue", undefined);
    },
    articles: function () {
        var curIssue = Session.get("currIssue");
        if (curIssue) {
            return Articles.find({issueId: curIssue}, {sort: {title: 1}});
        } else {
            var journalId = Session.get('currentJournalId');
            //return Articles.find({journalId: journalId}, {sort: {issue: -1}}); this shows all articles, uncomment for testing, below only shows latest issue as AIP
            var lastIssue = Issues.findOne({'journalId': journalId}, {sort: {'volume': -1, 'issue': -1}});
            if(lastIssue) Session.set("currIssue", lastIssue._id);
        }
    },
    getIssueTitle: function () {
        var curIssue = Session.get("currIssue");
        if (!curIssue) {
            return "latest issue";
        }
        else {
            var i = Issues.findOne({_id: curIssue});
            var title = "Volume " + i.volume + ", Issue " + i.issue + ", " + i.year + "/" + i.month;
            return title;
        }

    }
});

