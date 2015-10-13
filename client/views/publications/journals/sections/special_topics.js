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

Template.SpecialTopics.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            SpecialTopics.remove({_id:id});
        })
    }
});

Template.SpecialTopics.helpers({
    specialTopics: function(){
        return SpecialTopics.find();
    },
    year: function(){
        var id = Session.get("currentJournalId");
        var issue = Issues.findOne({journalId: id});
        if(issue)
        return issue.year;
    },
    name: function(){
        var id = Session.get("specialTopicsId");
        var specialTopics = SpecialTopics.findOne({_id: id});
        return specialTopics.title;
    }
})

AutoForm.addHooks(['addSpecialTopicsModalForm'], {
    onSuccess: function () {
        $("#addSpecialTopicsModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);