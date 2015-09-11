Template.AdvancedSearch.onRendered(function() {
    this.$('.datetimepicker').datetimepicker();
});

Template.AdvancedSearch.helpers({
    publisherList: function () {
        return Publishers.find();
    },
    publicationList: function () {
        return Publications.find();
    },
    topicList: function () {
        return Topics.find({parentId: undefined});
    },
    tagList: function () {
        return Tags.find();
    }

});

Template.UserSettingsUpdateInformationForm.events({
    "click #checkAll1": function () {
        $("input[name='profile.publications']").prop("checked", $("#checkAll1").is(":checked"));
    },
    "click #checkAll2": function () {
        $("input[name='profile.topics']").prop("checked", $("#checkAll2").is(":checked"));
    }
});