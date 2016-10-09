Meteor.publish('news_contact', function() {
    return NewsContact.find();
});

Meteor.publish('miniPlatformCulturePage', function (cultureId) {
    check(cultureId, String);
    return NewsContact.find({_id: cultureId});
});

Meteor.publish('miniPlatformNewsContact', function() {
    return NewsContact.find({types:"1"});
});

Meteor.publish('miniPlatformMagazineProfile', function() {
    return NewsContact.find({types:"2"});
});

Meteor.publish('miniPlatformCouncil', function() {
    return NewsContact.find({types:"3"});
});

Meteor.publish('miniPlatformMemorabilia', function() {
    return NewsContact.find({types:"4"});
});

Meteor.publish('miniPlatformSubscription', function() {
    return NewsContact.find({types:"5"});
});

Meteor.publish('miniPlatformEnterNews', function() {
    return NewsContact.find({types:"6"});
});

Meteor.publish('miniPlatformEditFields', function() {
    return NewsContact.find({types:"7"});
});

Meteor.publish('miniPlatformHistoryNews', function() {
    return NewsContact.find({types:"8"});
});

Meteor.publish('miniPlatformChiefEditor', function() {
    return NewsContact.find({types:"9"});
});