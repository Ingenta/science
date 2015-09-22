this.SpecialTopics = new Meteor.Collection("specialTopics");

SpecialTopicsSchema  = new SimpleSchema({
    title:{
        type:Science.schemas.MultiLangSchema
    },
    IssueId: {
        type: String,
        unique: true,
        autoform: {
            type: 'universe-select'
        }
    },
    guest_editor:{
        type:Science.schemas.MultiLangSchema
    },
    abstract:{
        type:Science.schemas.MultipleTextSchema
    }
});

Meteor.startup(function(){
    SpecialTopicsSchema.i18n("schemas.specialTopics");
    SpecialTopics.attachSchema(SpecialTopicsSchema);
})
