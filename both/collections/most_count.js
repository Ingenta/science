this.MostCount = new Meteor.Collection("most_count");

MostCountSchema = new SimpleSchema({
    ArticlesId: {
        type: [String]
    },
    journalId: {
        type: String,
        optional: true
    },
    type: {
        type: String,
        optional: true
    },
    createDate: {
        type: Date
    }
});
Meteor.startup(function () {
    MostCountSchema.i18n("schemas.mostCount");
    MostCount.attachSchema(MostCountSchema);
});