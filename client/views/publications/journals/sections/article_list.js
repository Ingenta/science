Template.journalNavigationPanel.helpers({
    volumeInJournal: function (journalId) {
        if (journalId) {
            var v = Volumes.find({'journalId': journalId}).fetch();
            return _.sortBy(v, function(oneVolume){ return parseInt(oneVolume.volume,10); }).reverse();
        }
    },
    issueInVolume: function (journalId, volume) {
        if (journalId && volume) {
            var issues = Issues.find({'journalId': journalId, 'volume': volume}).fetch();
            return _.sortBy(issues, function(oneIssue){ return parseInt(oneIssue.issue,10); }).reverse();
        }
    },
    formatMonth:function(){
        return this.month?(", "+this.month):"";
    },
    unionYear:function(){
        var issues = Issues.find({'journalId': this.journalId, 'volume': this.volume},{$fields:{year:1}}).fetch();
        var years = _.pluck(issues,'year');
        years = _.uniq(years.join(", ").split(/, ?/)).sort();
        if(!_.isEmpty(years))
            return "("+years.join(", ") +")"
    }
});

Template.journalNavigationPanel.events({
    "click .volume": function (event) {
        var toggleOption = ["fa-plus", "fa-minus"];
        var remove = $(event.currentTarget).find("i.fa-plus").length ? 0 : 1;
        $(event.currentTarget).find("i").removeClass(toggleOption[remove]).addClass(toggleOption[1 - remove]);
        $(event.currentTarget).next("div").toggle(200);
    },
    "click .issue": function (event) {
        var issueId = $(event.target).data().value;
        var volume = $(event.target).data().volume;
        var issue = $(event.target).data().issue;
        issueId && Session.set("currentIssueId", issueId);
        //if url contains issue, router.go
            Router.current().params.volume = volume;
            Router.current().params.issue = issue;
            Router.go("journal.name.toc", Router.current().params)
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
            return Articles.find({issueId: curIssue, pubStatus: pubStatus},{sort: {elocationId: -1}});
        } else {
            //Get the newest issue to display by default
            var journalId = Session.get('currentJournalId');
            var issues = Issues.find({'journalId': journalId}).fetch();
            var highestVolume = _.max(issues, function(i){ return parseInt(i.volume,10); }).volume;
            var issuesInThisVolume = Issues.find({'journalId': journalId, 'volume': highestVolume}).fetch();
            var lastIssue =  _.max(issuesInThisVolume, function(i){ return parseInt(i.issue,10); });
            if (lastIssue) Session.set("currentIssueId", lastIssue._id);
        }
    },
    getIssueTitle: function () {
        var curIssue = Session.get("currentIssueId");
        if (!curIssue) return;
        var i = Issues.findOne({_id: curIssue});
        if (!i)return;
        var title = TAPi18n.__("volumeItem", i.volume) + ", " + TAPi18n.__("issueItem", i.issue) + ", " + i.year;
        if(i.month)
            title+="/" + i.month;
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
