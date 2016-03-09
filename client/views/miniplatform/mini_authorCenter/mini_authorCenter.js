Template.authorCentered.helpers({
    journalsInPublisher: function () {
        var publisher = Publishers.findOne({agree: true});
        if (publisher)return Publications.find({publisher: publisher._id, visible:"1"},{sort: {title: 1}});
    },
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