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
    }
});

AutoForm.addHooks(['addPublisherModalForm'], {
    onSuccess: function () {
        $("#addPublisherModal").modal('hide');
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    }
}, true);

AutoForm.addHooks(['cmForm'], {
    onSuccess: function () {
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    }
}, true);
