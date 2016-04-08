this.SpecialTopics = new Meteor.Collection("specialTopics");

this.SpecialTopics.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-special-issue", "collections", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-special-issue", "collections", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-special-issue", "collections", userId);
    }
});

SpecialTopicsSchema  = new SimpleSchema({
    title:{
        type:Science.schemas.MultiLangSchema
    },
    journalId:{
        type: String
    },
    IssueId: {
        type: String,
        autoform: {
            type: 'universe-select'
        }
    },
    guest_editor:{
        type:Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    abstract:{
        type:Science.schemas.MultipleTextOptionalSchema,
        optional: true
    },
    articles:{
        type:[String],
        optional: true
    },
    order:{
        type: String,
        optional: true
    },
    createDate: {
        type: Date,
        optional: true
    },

});

Meteor.startup(function(){
    SpecialTopicsSchema.i18n("schemas.specialTopics");
    SpecialTopics.attachSchema(SpecialTopicsSchema);
});

if (Meteor.isClient) {
    mySpecialTopicsPagination = new Paginator(SpecialTopics);
}
