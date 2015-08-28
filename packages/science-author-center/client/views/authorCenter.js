Template.PublisherListForAuthorCenter.helpers({
    publishers: function () {
        return Publishers.find();
    }
});

Template.SinglePublisherForAuthorCenter.helpers({
    hasNoJournals: function (id) {
        return Publications.find({"publisher": id}).count() !== 0;
    },
    hasJournal: function(id){
        return Publications.find({"publisher": id});
    }
});
Template.SingleJournal.helpers({
    getJournalUrl:function(pubId){
        var publisher = Publishers.findOne({_id: pubId});
        return "/publisher/" + publisher.name + "/journal/" + this.title
    }
})