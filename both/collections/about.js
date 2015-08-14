this.About = new Meteor.Collection("about");

this.About.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-about", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-about", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-about", "resource", userId);
    }
});

AboutSchema = new SimpleSchema({
    titleEn: {
        type: String,
        unique: true
    },
    titleCn: {
        type: String
    },
    publications: {
        type: String
    }
});
Meteor.startup(function () {
    AboutSchema.i18n("schemas.about");
    About.attachSchema(AboutSchema);
});
