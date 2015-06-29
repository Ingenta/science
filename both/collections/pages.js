this.Pages = new Meteor.Collection("pages");

PagesSchema = new SimpleSchema({
    key: {
        type: String,
        unique: true
    },
    titleCN: {
        type: String
    },
    descriptionCN: {
        type: String,
        optional: true
    },
    titleEN: {
        type: String
    },
    descriptionEN: {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    PagesSchema.i18n("schemas.pages");
    Pages.attachSchema(PagesSchema);
});
