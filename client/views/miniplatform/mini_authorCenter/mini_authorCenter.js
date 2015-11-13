Template.authorCentered.helpers({
    journalsInPublisher: function () {
        var publisher = Publishers.findOne({agree: true});
        if (publisher)return Publications.find({publisher: publisher._id});
    }
});