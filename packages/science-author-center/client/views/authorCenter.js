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
        return Publications.find({"publisher": id,visible:"1"});
    }
});

Template.SingleJournal.helpers({
    urlToJournalAuthorCenter: function (id) {
        if(id){
            var journal = Publications.findOne({_id: id});

            if(journal){
                var publisher = Publishers.findOne({_id: journal.publisher});
                Session.set("activeTab", "Author Center");
                return "/publisher/"+publisher.shortname+"/journal/"+journal.shortTitle;
            }
        }
    }
});