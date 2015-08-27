Template.authorCenterList.helpers({
    authorResources: function () {
        var publicationId = Session.get('currentJournalId');
        return Publications.find({_id:publicationId});
    }
})
