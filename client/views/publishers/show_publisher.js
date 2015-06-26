Template.PublicationList.helpers({
    publications: function () {
        return myPubPagination.find({publisher: this._id}, {itemsPerPage: 10});
    }
});

Template.imageName.helpers({
    accessKeyIs: function (accessKey) {
        return this.accessKey === accessKey;
    }
});

Template.updatePublicationModalForm.helpers({
    getTitle: function () {
        return TAPi18n.__("Update");
    }
});
Template.deletePublicationModalForm.helpers({
    getPrompt: function () {
        return TAPi18n.__("Are you sure?");
    }
});


Template.SinglePublication.helpers({
    getJournalUrl: function (title) {
        return Router.current().url + "/journal/" + title;
    }
});

AutoForm.addHooks(['addPublicationModalForm'], {
    onSuccess: function () {
        $("#addPublicationModal").modal('hide');
        FlashMessages.sendSuccess("Success!", {hideDelay: 5000});
    },
    before: {
        insert: function (doc) {
            doc.publisher = Session.get('currentPublisher');
            return doc;
        }
    }
}, true);
