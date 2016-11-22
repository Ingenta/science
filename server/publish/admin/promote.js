Meteor.publish('advertisement', function() {
    return Advertisement.find();
});

Meteor.publish('HomeAdvertisementShowPage', function() {
    return Advertisement.find({types:"1"});
});

Meteor.publish('JournalAdvertisementShowPage', function(journalShortTitle) {
    if(!journalShortTitle)return this.ready();
    check(journalShortTitle, String);
    var journal = Publications.findOne({shortTitle: journalShortTitle});
    if(!journal)return this.ready();
    return Advertisement.find({types:"2",publications:journal._id});
});