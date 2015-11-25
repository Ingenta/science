Meteor.publish('emailConfig', function() {
    return EmailConfig.find();
});
