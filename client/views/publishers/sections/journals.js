Template.JournalTabInPublisher.helpers({
    publisher: function() {
        return Router.current().data();
    }
});

Template.PublicationList.helpers({
    publications: function () {
        var pubId = this._id;
        var first = Session.get('pubFirstLetter');
        var numPerPage = Session.get('PerPage');
        if(numPerPage === undefined){
            numPerPage = 10;
        }
        var q = {};
        pubId && (q.publisher = pubId);
        var reg;
        if(first && first == "other"){
            reg="^[^A-Z]"
        }else{
            reg = "^" + first;
        }
        first && (q.shortTitle = {$regex:reg, $options: "i"});
        Session.set("totalPublicationResults", Publications.find(q).count());
        return myPubPagination.find(q, {itemsPerPage: numPerPage});
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