this.SpecialTopics = new Meteor.Collection("specialTopics");

this.SpecialTopics.allow({
    insert: function (userId, doc) {
        return Permissions.userCan("add-specialTopics", "resource", userId);
    },
    update: function (userId, doc) {
        return Permissions.userCan("modify-specialTopics", "resource", userId);
    },
    remove: function (userId, doc) {
        return Permissions.userCan("delete-specialTopics", "resource", userId);
    }
});

SpecialTopicsSchema  = new SimpleSchema({
    title:{
        type:Science.schemas.MultiLangSchema
    },
    IssueId: {
        type: String,
        autoform: {
            type: 'universe-select'
        }
    },
    guest_editor:{
        type:Science.schemas.MultiLangSchema
    },
    abstract:{
        type:Science.schemas.MultipleTextOptionalSchema
    }
});

Meteor.startup(function(){
    SpecialTopicsSchema.i18n("schemas.specialTopics");
    SpecialTopics.attachSchema(SpecialTopicsSchema);
})
