this.About = new Meteor.Collection("about");

AboutSchema = new SimpleSchema({
    title: {
        type: String,
        unique: true
    },
    chinesetitle: {
        type: String,
        max: 1
    },
    publications: {
        type: String
    }
});
Meteor.startup(function () {
    AboutSchema.i18n("schemas.about");
    About.attachSchema(AboutSchema);
});
