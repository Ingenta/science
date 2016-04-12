Template.journalNavigationPanel.onCreated(function () {
    this.volumes = new ReactiveVar(0);
    var x = this.volumes;
    Meteor.call("volumesAtJournal", this.data._id, function (err, response) {
        if (err) console.log(err);
        x.set(response);
    })
})

Template.journalNavigationPanel.helpers({
    volumeInJournal: function () {
        return Template.instance().volumes.get()
    },
    issueInVolume: function (journalId, volume) {
        if (journalId && volume) {
            var issues = Issues.find({'journalId': journalId, 'volume': volume}).fetch();
            return _.sortBy(issues, function (oneIssue) {
                return parseInt(oneIssue.issue, 10);
            }).reverse();
        }
    },
    unionYear: function () { //TODO: this is inefficient consider moving year to volumes collection
        var issues = Issues.find({'journalId': this.journalId, 'volume': this.volume}, {fields: {year: 1}}).fetch();
        var years = _.pluck(issues, 'year');
        years = _.uniq(years.join(", ").split(/, ?/)).sort();
        if (!_.isEmpty(years))
            return "(" + years.join(", ") + ")"
    },
    class: function () {
        return this._id === Session.get("currentVolumeId") ? "fa-minus" : "fa-plus";
    },
    issueDisplay: function () {
        return this._id === Session.get("currentVolumeId") ? "block" : "none";
    }
});

Template.journalNavigationPanel.events({
    "click .volume": function (event) {
        var toggleOption = ["fa-plus", "fa-minus"];
        var remove = $(event.currentTarget).find("i.fa-plus").length ? 0 : 1;
        $(event.currentTarget).find("i").removeClass(toggleOption[remove]).addClass(toggleOption[1 - remove]);
        $(event.currentTarget).next(".issues").slideToggle(200);
    },
    "click .issue": function (event) {
        var issueId = $(event.target).data().value;
        issueId && Session.set("currentIssueId", issueId);
        window.location.hash = issueId;
    }
});

Template.articleList.helpers({
    IsArticleListReady: function () {
        //will get journal tabs template where instance variable is set
        return Template.instance().parent(2,true).waiting.get()
    }
})
Template.articleListRight.helpers({
    articles: function () {
        if (Template.currentData().pubStatus === 'accepted') {
            return Articles.find({pubStatus: Template.currentData().pubStatus}, {sort: {accepted: -1}});
        }
        if (Template.currentData().pubStatus === 'online_first') {
            return Articles.find({pubStatus: Template.currentData().pubStatus}, {sort: {elocationId: 1}});
        }
        if (Template.currentData().pubStatus === 'normal') {
            query = {pubStatus: {$ne: 'accepted'}, issueId: Session.get("currentIssueId")}
            return Articles.find(query, {sort: {elocationId: 1}});
        }
    },
    getIssueTitle: function () {
        var curIssue = Session.get("currentIssueId");
        if (curIssue) {
            var i = Issues.findOne({_id: curIssue});
        } else {
            var v = Volumes.findOne({'journalId': this._id}, {sort: {volume: -1}});
            if (!v)return;
            var i = Issues.findOne({'journalId': this._id, 'volume': v.volume}, {sort: {order: -1}});
        }
        if (!i)return;
        var title = TAPi18n.__("volumeItem", i.volume) + ", " + TAPi18n.__("issueItem", i.issue) + ", ";
        if (i.month) {
            var months = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            if (TAPi18n.getLanguage() === "en") {
                title += months[i.month] + " " + i.year;
            } else {
                title += i.year + "年" + i.month + "月";
            }
        } else {
            title += i.year;
        }
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
Template.HistoricalJournalTable.helpers({
    historicalJournals: function () {
        if (this.historicalJournals)
            return Publications.find({_id: {$in: this.historicalJournals}}, {sort: {publicationDate: -1}});
    }
});

Template.historicalJournalNavigationPanel.helpers({
    hasHisJournal: function () {
        return !_.isEmpty(this.historicalJournals)
    },
    sortedHisJournal: function () {
        if (this.historicalJournals)
            return Publications.find({_id: {$in: this.historicalJournals}}, {sort: {publicationDate: -1}});
    },
    whichUrl: function () {
        if (this._id)
            return getJournalComponentByJournalId(this._id);
    }
})