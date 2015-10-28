Template.miniPublisherListForAuthorCenter.helpers({
    publishers: function () {
        return Publishers.find();
    }
});

Template.miniSinglePublisherForAuthorCenter.helpers({
    hasNoJournals: function (id) {
        return Publications.find({"publisher": id}).count() !== 0;
    },
    hasJournal: function(id){
        return Publications.find({"publisher": id});
    }
});
Template.miniSingleJournal.helpers({
    getJournalUrl:function(pubId){
        var publisher = Publishers.findOne({_id: pubId});
        Session.set("activeTab", "Author Center");
        return "/publisher/" + publisher.name + "/journal/" + this.title
    }
})