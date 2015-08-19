Template.JournalTabInPublisher.helpers({
    publisher: function() {
        return Router.current().data();
    }
});

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

Template.displayPublication.helpers({
    visibleIs: function (visible) {
        return this.visible === visible;
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
            if(doc.issn) doc.issn = doc.issn.trim().replace("-","");
            return doc;
        }
    }
}, true);

Template.displayPublication.events({
    'click .fa-eye': function (event) {
        Publications.update({_id:this._id},{$set:{visible:2}});
        Publications.update({_id:this._id},{$set:{visible:0}});
    },
    'click .fa-eye-slash': function (event) {
        Publications.update({_id:this._id},{$set:{visible:1}});
    }
});