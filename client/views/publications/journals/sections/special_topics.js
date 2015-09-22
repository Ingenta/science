Template.addSpecialTopicsForm.helpers({
    issue: function () {
        var id = Session.get("currentJournalId");
        var issue = Issues.find({journalId: id}).fetch();
        var result = [];
        if (TAPi18n.getLanguage() === "zh-CN") {
            _.each(issue, function (item) {
                result.push({label: TAPi18n.__('Volume') + ": "+ item.volume + "-"+ TAPi18n.__('Issue') + ": " + item.issue, value: item._id});
            });
        } else {
            _.each(issue, function (item) {
                result.push({label: TAPi18n.__('Volume') + ": "+ item.volume + "-"+ TAPi18n.__('Issue') + ": " + item.issue, value: item._id});
            });
        }
        return result;
    }
})

Template.SpecialTopics.helpers({
    issueId: function(){
        var id = Session.get("currentJournalId");
        var issue = Issues.find({journalId: id}).fetch();
        return issue;
    },
    year: function(){
        var id = Session.get("currentJournalId");
        var issue = Issues.findOne({journalId: id});
        return issue.year;
}
})

AutoForm.addHooks(['addSpecialTopicsModalForm'], {
    onSuccess: function () {
        $("#addSpecialTopicsModalForm").modal('hide');
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    }
}, true);