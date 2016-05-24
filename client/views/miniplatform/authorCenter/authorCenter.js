Template.authorCentered.helpers({
    journalsInPublisher: function () {
        var publisher = Publishers.findOne({shortname : Config.defaultPublisherShortName});
        if (publisher)return Publications.find({publisher: publisher._id, visible:"1"},{sort: {title: 1}});
    },
    urlToJournalAuthorCenter: function (id) {
        var journal = Publications.findOne({_id: id}, {fields: {shortTitle: 1, publisher: 1}});
        if (!journal)return;
        var pub = Publishers.findOne({_id: journal.publisher}, {fields: {shortname: 1}});
        if (!pub)return;
        return "http://engine.scichina.com/publisher/" + pub.shortname + "/journal/" + journal.shortTitle+"?slug=Author Center";
    }
});