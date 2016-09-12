Template.collectionsList.helpers({
    collections: function () {
        //dont use session journalid if this is a publisher page
        var journalId
        if (Router.current().route.getName() !== "publisher.name")
            journalId = Session.get("currentJournalId");
        var pubId = Session.get('filterPublisher');
        var first = Session.get('firstLetter');
        var numPerPage = Session.get('PerPage') || 10;
        var q = {};
        pubId && (q.publisherId = pubId);
        journalId && (q.journalId = journalId);
        var reg;
        if (first && first == "other") {
            reg = "^[^A-Z]"
        } else {
            reg = "^" + first;
        }
        first && (q["title.en"] = {$regex: reg, $options: "i"});
        return collPaginator.find(q, {itemsPerPage: numPerPage, sort: {createDate: -1}});
    },
    collectionPageCount: function () {
        var journalId
        if (Router.current().route.getName() !== "publisher.name")
            journalId = Session.get("currentJournalId");
        var pubId = Session.get('filterPublisher');
        var first = Session.get('firstLetter');
        var q = {};
        pubId && (q.publisherId = pubId);
        journalId && (q.journalId = journalId);
        var reg;
        if (first && first == "other") {
            reg = "^[^A-Z]"
        } else {
            reg = "^" + first;
        }
        first && (q["title.en"] = {$regex: reg, $options: "i"});
        return ArticleCollections.find(q).count() > 10;
    }
});

Template.updateCollectionForm.helpers({
    getTitle: function () {
        return TAPi18n.__("Update");
    }
})

Template.oneCollection.events({
    "click a.fa-trash": function (e) {
        e.preventDefault();
        var collId = this._id;
        confirmDelete(e, function () {
            ArticleCollections.remove({_id: collId});
        })
    }
})

Template.oneCollection.helpers({
    "underPublisherPage":function(){
        return Router.current().route.getName() == "publisher.name";
    }
})