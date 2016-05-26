this.About = new Meteor.Collection("about");

this.About.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    },
    remove: function (userId, doc) {
        return Permissions.userCan("modify-journal", "resource", userId,{journal:doc.publications});
    }
});

AboutSchema = new SimpleSchema({
    title: {
        type: Science.schemas.MultipleTextRequiredSchema
    },
    agree: {
        type: Boolean,
        defaultValue: false
    },
    publications: {
        type: String
    }
});
Meteor.startup(function () {
    AboutSchema.i18n("schemas.about");
    About.attachSchema(AboutSchema);
});
