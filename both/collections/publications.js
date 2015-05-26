this.Publications = new Meteor.Collection("publications");

PublicationsSchema  = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    urlname: {
        type: String,
        unique: true
    },
    description: {
        type: String,
        min: 7,
        autoform: {
            rows: 3
        }
    },
	choose: {
      type: String,
      allowedValues: [
         "Free Content",
         "Open Access Content",
         "Subscribed Content",
	     "Free Trial Content",
      ],
      optional: false,
      label: "Choose a content type"
	}
});
Meteor.startup(function() {
    PublicationsSchema .i18n("schemas.publications");
    Publications.attachSchema(PublicationsSchema);
});

this.Publications.userCanInsert = function(userId, doc) {
	return true;
}

this.Publications.userCanUpdate = function(userId, doc) {
	return true;
}

this.Publications.userCanRemove = function(userId, doc) {
	return true;
}
