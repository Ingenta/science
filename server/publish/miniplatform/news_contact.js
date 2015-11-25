Meteor.publish('news_contact', function() {
    return NewsContact.find();
});