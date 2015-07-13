this.Issues = new Meteor.Collection("issues");

IssuesSchema = new SimpleSchema({
    description: {
        type: String,
        optional: true,
        autoform: {
            rows: 4
        }
    }
});

Meteor.startup(function () {
    IssuesSchema.i18n("schemas.issues");
    Issues.attachSchema(IssuesSchema);
});
