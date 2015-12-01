Template.PublisherList.helpers({
    publishers: function () {
        return Publishers.find();
    }
});

Template.SinglePublisher.events({
    'click .fa-trash': function (e) {
        var id = this._id;
        confirmDelete(e,function(){
            Publishers.remove({_id:id});
        })
    }
});

Template.updatePublisherModalForm.helpers({
    getTitle: function () {
        return TAPi18n.__("Update");
    }
});

Template.SinglePublisher.helpers({
    hasNoJournals: function (id) {
        return Publications.find({"publisher": id}).count() !== 0;
    },
    canModifyPublisher: function (id) {
        return Permissions.userCan("modify-publisher", "publisher", Meteor.userId(), {publisher: id});
    }
});

AutoForm.addHooks(['addPublisherModalForm'], {
    onSuccess: function () {
        $("#addPublisherModal").modal('hide');
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);

AutoForm.addHooks(['cmForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess(TAPi18n.__("Success"), {hideDelay: 3000});
    }
}, true);
