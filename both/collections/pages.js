this.Pages = new Meteor.Collection("pages");

PagesSchema = new SimpleSchema({
    key: {
        type: String,
        unique: true
    },
    "title.cn": {
        type: String
    },
    "description.cn": {
        type: String,
        optional: true
    },
    "title.en": {
        type: String
    },
    "description.en": {
        type: String,
        optional: true
    }
});
Meteor.startup(function () {
    PagesSchema.i18n("schemas.pages");
    Pages.attachSchema(PagesSchema);
});
