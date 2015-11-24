this.Pages = new Meteor.Collection("pages");

PagesSchema = new SimpleSchema({
    key: {
        type: String,
        unique: true
    },
    title: {
        type: Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    description: {
        type: Science.schemas.MultipleAreaSchema,
        optional: true
    }
});
Meteor.startup(function () {
    PagesSchema.i18n("schemas.pages");
    Pages.attachSchema(PagesSchema);
});
