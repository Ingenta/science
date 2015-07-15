this.Issues = new Meteor.Collection("issues");

IssuesSchema = new SimpleSchema({
    journalId:{
        type: String
    },
    volume:{
        type: String
    },
    issue:{
        type: String
    },
    year: {
        type: String
    },
    month: {
        type: String
    },
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
