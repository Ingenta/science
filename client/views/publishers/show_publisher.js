Template.PublicationList.helpers({
    publications: function () {
        var numPerPage = Session.get('PerPage');
        if(numPerPage === undefined){
            numPerPage = 10;
        }
        return myPubPagination.find({publisher: this._id}, {itemsPerPage: numPerPage});
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

Template.PublicationList.events({
    'click .perPage': function (event) {
        var pageNum = $(event.target).data().pagenum;
        Session.set('PerPage', pageNum);
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
            doc.publisher = Session.get('currentPublisherId');
            if(doc.issn) doc.issn = doc.issn.replace("-","");
            return doc;
        }
    }
}, true);
