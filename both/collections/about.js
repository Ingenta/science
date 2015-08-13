this.About = new Meteor.Collection("about");

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
