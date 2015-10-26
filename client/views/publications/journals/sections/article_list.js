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
        var toggleOption = ["fa-plus", "fa-minus"];
        var remove = $(event.currentTarget).find("span.fa-plus").length ? 0 : 1;
        $(event.currentTarget).find("span").removeClass(toggleOption[remove]).addClass(toggleOption[1 - remove]);
        $(event.currentTarget).next("div").toggle(200);
    },
    "click .issue": function (event) {
        var issueId = $(event.target).data().value;
        var volume = $(event.target).data().volume;
        var issue = $(event.target).data().issue;
        issueId && Session.set("currentIssueId", issueId);
        //if url contains issue, router.go
        if (Router.current().params.volume && Router.current().params.issue) {
            Router.current().params.volume = volume;
            Router.current().params.issue = issue;
            Router.go("journal.name.volume", Router.current().params)
        }
    }
});


Template.articleListRight.helpers({
    resetArticlesFilter: function () {
        //Only reset session if volume and issue aren't set
        if (!Router.current().params.volume)
            if (!Router.current().params.issue)
                Session.set("currentIssueId", undefined);
    },
    articles: function () {
        var pubStatus = Template.currentData().pubStatus;
        var curIssue = Session.get("currentIssueId");
        if (curIssue) {
            return Articles.find({issueId: curIssue, pubStatus: pubStatus}, {sort: {title: 1}});
        } else {
            var journalId = Session.get('currentJournalId');
            //return Articles.find({journalId: journalId}, {sort: {issue: -1}}); this shows all articles, uncomment for testing, below only shows latest issue as AIP
            var lastIssue = Issues.findOne({'journalId': journalId}, {sort: {'volume': -1, 'issue': -1}});
            if (lastIssue) Session.set("currentIssueId", lastIssue._id);
        }
    },
    getIssueTitle: function () {
        var curIssue = Session.get("currentIssueId");
        if (!curIssue) return;
        var i = Issues.findOne({_id: curIssue});
        if (!i)return;
        var title = TAPi18n.__("volumeItem", i.volume) + ", " + TAPi18n.__("issueItem", i.issue) + ", " + i.year + "/" + i.month;
        return title;


    },
    issueContext: function () {
        var curIssue = Session.get("currentIssueId");
        if (curIssue) {
            return Issues.findOne({_id: curIssue});
        }
    },
    normal: function () {
        return Template.currentData().pubStatus == "normal"
    }
});
