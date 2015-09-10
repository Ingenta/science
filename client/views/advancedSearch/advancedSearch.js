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